import { Link } from 'react-router-dom';
import { getLoginPath } from '../config/portal';
import { Check } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';

export default function RegistratieGelukt() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8">
        <Link to="/">
          <LogoText theme="light" className="text-2xl" />
        </Link>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <Check className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A] mb-2">Account aangemaakt</h1>
        <p className="text-slate-600 mb-6">
          We hebben een e-mail gestuurd om uw e-mailadres te verifiëren. Klik op de link in de e-mail. U komt dan op een bedankpagina waar u kunt inloggen om uw profiel af te maken.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to={getLoginPath()}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20 text-center"
          >
            Naar inloggen
          </Link>
          <Link to="/email-verificatie" className="text-[#0F172A] hover:underline text-sm">
            Meer over e-mailverificatie
          </Link>
        </div>
      </div>
    </div>
  );
}
