import { Link } from 'react-router-dom';
import { getLoginPath } from '../config/portal';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';

export default function EmailVerificatie() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="mb-8">
        <Link to="/">
          <LogoText theme="light" className="text-2xl" />
        </Link>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A]">E-mail verifiëren</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Na uw aanmelding stuurt ArboMatcher een verificatie-e-mail naar het adres dat u heeft opgegeven. U moet deze stap voltooien voordat u volledig kunt inloggen.
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-800">Wat moet ik doen?</p>
              <p className="text-sm text-slate-600 mt-1">
                Open uw e-mail en klik op de link in de mail van ArboMatcher. Die link bevestigt uw adres. Daarna kunt u gewoon inloggen.
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Geen e-mail gezien?</p>
              <p className="text-sm text-amber-800 mt-1">
                Controleer uw map <strong>Ongewenst / Spam</strong>. De mail kan daar terechtkomen. Wacht anders een paar minuten en ververs uw inbox.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={getLoginPath()}
            className="flex-1 text-center bg-[#0F172A] text-white py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
          >
            Naar inloggen
          </Link>
          <Link
            to="/"
            className="flex-1 text-center py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}
