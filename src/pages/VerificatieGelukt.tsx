import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLoginPath } from '../config/portal';
import { triggerAccountBevestigdEmail } from '../services/emailService';
import { CheckCircle } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';

export default function VerificatieGelukt() {
  const { user, signOut } = useAuth();
  const signedOutRef = useRef(false);

  useEffect(() => {
    if (user && !signedOutRef.current) {
      signedOutRef.current = true;
      triggerAccountBevestigdEmail().finally(() => {
        signOut().then(() => {
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        });
      });
    }
  }, [user, signOut]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8">
        <Link to="/">
          <LogoText theme="light" className="text-2xl" />
        </Link>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A] mb-2">E-mail geverifieerd</h1>
        <p className="text-gray-600 mb-6">
          Bedankt voor het verifiëren van je e-mailadres. Log opnieuw in om je profiel af te maken.
        </p>
        <Link
          to={getLoginPath()}
          className="inline-block w-full bg-[#0F172A] text-white py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition text-center"
        >
          Inloggen
        </Link>
      </div>
    </div>
  );
}
