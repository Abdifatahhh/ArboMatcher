import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getLoginPath } from '../config/portal';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';

export default function WachtwoordVergeten() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/wachtwoord-reset`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8">
        <Link to="/">
          <LogoText theme="light" className="text-2xl" />
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-4">Wachtwoord vergeten</h1>

        {success ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-800">
                We hebben een e-mail gestuurd naar <strong>{email}</strong> met instructies om uw wachtwoord te herstellen.
              </p>
            </div>
            <Link
              to={getLoginPath()}
              className="block w-full text-center text-[#0F172A] hover:underline font-medium"
            >
              Terug naar inloggen
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              Vul hieronder het e-mailadres in waarmee u bekend bent bij ArboMatcher. Wij sturen u vervolgens een e-mail waarmee u het wachtwoord kunt herstellen.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-500 mb-2">
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                  placeholder="Vul hier uw e-mailadres in"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'Bezig...' : 'Wachtwoord herstellen'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to={getLoginPath()} className="text-[#0F172A] hover:underline font-medium">
                Terug naar inloggen
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
