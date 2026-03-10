import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginPath } from '../config/portal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { Check } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';

const POLL_INTERVAL_MS = 2500;
const REDIRECT_DELAY_MS = 4000;
const TOAST_DURATION_MS = 8000;
/** Laptop moet bij registratie een sessie hebben (Supabase: sessie bij signUp vóór e-mailbevestiging). Dan kan refreshSession() na verificatie (telefoon of laptop) de update ophalen en doorsturen. */

function isEmailConfirmed(user: { email_confirmed_at?: string | null; identities?: Array<{ identity_data?: { email_confirmed_at?: string } }> } | null): boolean {
  if (!user) return false;
  if (user.email_confirmed_at) return true;
  const fromIdentity = user.identities?.[0]?.identity_data?.email_confirmed_at;
  return !!fromIdentity;
}

export default function RegistratieGelukt() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const notified = useRef(false);

  const handleGoToLogin = async () => {
    await signOut();
    navigate(getLoginPath(), { replace: true });
  };

  useEffect(() => {
    if (isEmailConfirmed(user) && !notified.current) {
      notified.current = true;
      toast.success('Je bent geverifieerd. Je kunt nu inloggen.', TOAST_DURATION_MS);
      setTimeout(() => navigate(getLoginPath(), { replace: true }), REDIRECT_DELAY_MS);
    }
  }, [user, toast, navigate]);

  useEffect(() => {
    if (notified.current) return;
    if (user && isEmailConfirmed(user)) return;

    const checkAndRedirect = async () => {
      if (notified.current) return;
      await supabase.auth.refreshSession();
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user ?? null;
      if (isEmailConfirmed(u) && !notified.current) {
        notified.current = true;
        toast.success('Je bent geverifieerd. Je kunt nu inloggen.', TOAST_DURATION_MS);
        setTimeout(() => navigate(getLoginPath(), { replace: true }), REDIRECT_DELAY_MS);
      }
    };

    checkAndRedirect();
    const t = setInterval(checkAndRedirect, POLL_INTERVAL_MS);
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
          We hebben een e-mail gestuurd om je adres te verifiëren. Klik op de link in de e-mail (op je telefoon of laptop). Houd dit scherm open staan; zodra je hebt bevestigd, zie je hier een melding en word je doorgestuurd naar inloggen.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoToLogin}
            className="w-full bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition text-center"
          >
            Naar inloggen
          </button>
          <Link to="/email-verificatie" className="text-[#4FA151] hover:underline text-sm">
            Meer over e-mailverificatie
          </Link>
        </div>
      </div>
    </div>
  );
}
