import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginPath } from '../config/portal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { Check } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';

const POLL_INTERVAL_MS = 3000;

export default function RegistratieGelukt() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const notified = useRef(false);

  useEffect(() => {
    if (!user || user.email_confirmed_at || notified.current) return;
    const t = setInterval(async () => {
      const { data } = await supabase.auth.refreshSession();
      const u = data.session?.user;
      if (u?.email_confirmed_at && !notified.current) {
        notified.current = true;
        toast.success('Je bent geverifieerd. Je kunt nu inloggen.');
        navigate(getLoginPath(), { replace: true });
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [user, toast, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8">
        <LogoText theme="light" className="text-2xl" />
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <Check className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A] mb-2">Account aangemaakt</h1>
        <p className="text-gray-600 mb-6">
          We hebben een e-mail gestuurd om je adres te verifiëren. Klik op de link in de e-mail. Zodra je dat hebt gedaan, zie je hier een melding en kun je inloggen.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to={getLoginPath()}
            className="w-full bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition text-center"
          >
            Naar inloggen
          </Link>
          <Link to="/email-verificatie" className="text-[#4FA151] hover:underline text-sm">
            Meer over e-mailverificatie
          </Link>
        </div>
      </div>
    </div>
  );
}
