import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLink } from '../components/AuthLink';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Wifi, Lock, Clock, Shield, Database, HelpCircle, CheckCircle } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import type { AuthErrorCategory } from '../utils/auth';

const errorIcons: Record<AuthErrorCategory, typeof AlertCircle> = {
  invalid_credentials: Lock,
  email_not_confirmed: AlertCircle,
  too_many_requests: Clock,
  network_error: Wifi,
  permission_denied: Shield,
  schema_error: Database,
  user_not_found: HelpCircle,
  unknown: AlertCircle,
};

interface LoginProps {
  showAlreadyLoggedInBanner?: boolean;
}

export default function Login({ showAlreadyLoggedInBanner }: LoginProps) {
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorCategory, setErrorCategory] = useState<AuthErrorCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signOut, healthStatus, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !profile || loading) return;
    if (showAlreadyLoggedInBanner) return;
    if (profile.role !== 'ADMIN' && profile.onboarding_completed !== true) {
      navigate('/onboarding', { replace: true });
      return;
    }
    if (profile.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (profile.role === 'professional') {
      navigate('/professional/dashboard', { replace: true });
      return;
    }
    if (profile.role === 'ORGANISATIE') {
      navigate('/organisatie/dashboard', { replace: true });
      return;
    }
    navigate('/', { replace: true });
  }, [user, profile, navigate, showAlreadyLoggedInBanner, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorCategory(null);
    setLoading(true);

    const { profile: userProfile, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.userMessage);
      setErrorCategory(signInError.category);
      setLoading(false);
      return;
    }

    if (userProfile?.role !== 'ADMIN' && userProfile?.onboarding_completed !== true) {
      navigate('/onboarding', { replace: true });
    } else if (userProfile?.role === 'professional') {
      navigate('/professional/dashboard', { replace: true });
    } else if (userProfile?.role === 'ORGANISATIE') {
      navigate('/organisatie/dashboard', { replace: true });
    } else if (userProfile?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const ErrorIcon = errorCategory ? errorIcons[errorCategory] : AlertCircle;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-8 md:pt-24 md:pb-12 px-4">
      <div className="w-full max-w-md">
        {showAlreadyLoggedInBanner && user?.email && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
            <p className="font-medium text-emerald-900 mb-2">U bent al ingelogd ({user.email})</p>
            <p className="text-emerald-800 mb-3">Wilt u doorgaan met registratie of met een ander account inloggen?</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate('/onboarding', { replace: true })}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-500 transition"
              >
                Doorgaan naar onboarding
              </button>
              <button
                type="button"
                onClick={async () => { await signOut(); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Uitloggen
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center mb-8 md:mb-10">
          <LogoText theme="light" className="text-2xl md:text-3xl" />
        </div>

        {healthStatus && !healthStatus.healthy && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
            <div className="flex items-start">
              <Database className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Database probleem</p>
                <p className="text-xs text-amber-700 mt-1">{healthStatus.error}</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-5 md:mb-6">Inloggen</h1>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          {verified && !error && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start text-sm">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-green-800">Uw e-mail is geverifieerd. Log in om verder te gaan.</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start text-sm">
              <ErrorIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800">{error}</p>
                {errorCategory === 'email_not_confirmed' && (
                  <Link to="/email-verificatie" className="text-[#0F172A] hover:underline mt-2 inline-block">
                    Meer over e-mailverificatie
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] placeholder:text-slate-400 outline-none"
                placeholder="Vul hier uw e-mailadres in"
              />
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] placeholder:text-slate-400 outline-none"
                placeholder="Vul hier uw wachtwoord in"
              />
              <div className="mt-2">
                <Link to="/wachtwoord-vergeten" className="text-xs text-slate-500 hover:text-[#0F172A] font-medium transition">
                  Wachtwoord vergeten?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-slate-500 text-sm">
              Nog geen account?{' '}
              <AuthLink to="/register" className="text-[#0F172A] hover:underline font-semibold">
                Maak een nieuw account
              </AuthLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
