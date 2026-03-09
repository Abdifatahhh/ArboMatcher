import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

export default function Login() {
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorCategory, setErrorCategory] = useState<AuthErrorCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, healthStatus, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !profile) return;
    if (profile.role !== 'ADMIN' && profile.onboarding_completed !== true) {
      navigate('/onboarding', { replace: true });
      return;
    }
    if (profile.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (profile.role === 'professional') {
      navigate('/arts/dashboard', { replace: true });
      return;
    }
    if (profile.role === 'OPDRACHTGEVER') {
      navigate('/opdrachtgever/dashboard', { replace: true });
      return;
    }
    navigate('/', { replace: true });
  }, [user, profile, navigate]);

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
      navigate('/onboarding');
    } else if (userProfile?.role === 'professional') {
      navigate('/arts/dashboard');
    } else if (userProfile?.role === 'OPDRACHTGEVER') {
      navigate('/opdrachtgever/dashboard');
    } else if (userProfile?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }

    setLoading(false);
  };

  const ErrorIcon = errorCategory ? errorIcons[errorCategory] : AlertCircle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white flex flex-col items-center pt-6 pb-8 md:pt-24 md:pb-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 md:mb-10">
          <Link to="/">
            <LogoText theme="light" className="text-5xl min-[768px]:text-2xl" />
          </Link>
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

        <div className="bg-white md:rounded-2xl md:shadow-sm md:p-8 md:border md:border-slate-100">
          {verified && !error && (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start text-sm">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-green-800">Je e-mail is geverifieerd. Log in om verder te gaan.</p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-sm">
              <ErrorIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800">{error}</p>
                {errorCategory === 'email_not_confirmed' && (
                  <Link to="/email-verificatie" className="text-[#4FA151] hover:underline mt-2 inline-block">
                    Meer over e-mailverificatie
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition text-[#0F172A] placeholder:text-gray-400"
                placeholder="Vul hier je e-mailadres in"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition text-[#0F172A] placeholder:text-gray-400"
                placeholder="Vul hier je wachtwoord in"
              />
            </div>

            <div>
              <Link to="/wachtwoord-vergeten" className="text-sm text-[#4FA151] hover:underline font-medium">
                Wachtwoord vergeten?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4FA151] text-white py-3.5 rounded-lg font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#0F172A]/80 text-sm">
              Nog geen account?{' '}
              <Link to="/register" className="text-[#4FA151] hover:underline font-semibold">
                Maak een nieuw account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
