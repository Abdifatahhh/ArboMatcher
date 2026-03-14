import { useState } from 'react';
import { Lock } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import { getMaintenanceSettings, setMaintenanceBypass } from '../lib/maintenance';

interface MaintenancePageProps {
  onBypass: () => void;
}

export default function MaintenancePage({ onBypass }: MaintenancePageProps) {
  const settings = getMaintenanceSettings();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!settings.password) {
      setError('Geen toegangswachtwoord ingesteld. Neem contact op met de beheerder.');
      return;
    }
    if (password !== settings.password) {
      setError('Onjuist wachtwoord.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setMaintenanceBypass();
    onBypass();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <LogoText theme="light" className="text-2xl" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center justify-center gap-2 text-slate-800">
              <Lock className="w-6 h-6 text-slate-700" />
              <h1 className="text-xl font-semibold">Onderhoudsmodus</h1>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-slate-700 whitespace-pre-line">{settings.message}</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="maintenance-access-password" className="block text-sm font-medium text-slate-700 mb-2">
                  Toegangswachtwoord
                </label>
                <input
                  id="maintenance-access-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wachtwoord voor toegang tijdens onderhoud"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition placeholder:text-slate-400"
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-4 py-2.5 rounded-xl font-medium hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? 'Bezig...' : 'Toegang vragen'}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Heeft u het toegangswachtwoord? Voer het in om de site te bekijken.
        </p>
      </div>
    </div>
  );
}
