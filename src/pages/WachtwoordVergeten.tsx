import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center py-12 px-4">
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
                We hebben een e-mail gestuurd naar <strong>{email}</strong> met instructies om je wachtwoord te herstellen.
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full text-center text-[#4FA151] hover:underline font-medium"
            >
              Terug naar inloggen
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Vul hieronder het e-mailadres in waarmee je bekend bent bij ArboMatch. Wij sturen je vervolgens een mail waarmee je het wachtwoord kan herstellen.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                  placeholder="Vul hier je e-mailadres in"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4FA151] text-white py-3 rounded-lg font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Bezig...' : 'Wachtwoord herstellen'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-[#4FA151] hover:underline font-medium">
                Terug naar inloggen
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
