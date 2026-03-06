import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings } from 'lucide-react';

const STORAGE_KEY = 'arbomatcher_cookie_consent';

type Consent = 'all' | 'necessary' | 'custom' | null;

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Consent | null;
    if (!stored) setVisible(true);
  }, []);

  const save = (value: Consent) => {
    localStorage.setItem(STORAGE_KEY, value ?? 'necessary');
    setVisible(false);
    setShowDetails(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#4FA151]/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-[#4FA151]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#0F172A] mb-1">Cookies & privacy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Wij gebruiken cookies voor het functioneren van de site, analyses en om uw voorkeuren te onthouden.
                U kunt kiezen voor alleen noodzakelijke cookies of alles accepteren. Lees meer in ons{' '}
                <Link to="/privacy" className="text-[#4FA151] font-medium hover:underline">privacybeleid</Link>.
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked disabled className="rounded border-gray-300 text-[#4FA151]" />
                <span>Noodzakelijk – vereist voor de werking van de site</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#4FA151]" />
                <span>Analytisch – helpt ons het gebruik te begrijpen</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-[#4FA151]" />
                <span>Voorkeuren – onthoudt uw instellingen</span>
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => save('all')}
              className="px-4 py-2.5 bg-[#4FA151] text-white rounded-xl font-semibold text-sm hover:bg-[#3E8E45] transition"
            >
              Alles accepteren
            </button>
            <button
              onClick={() => save('necessary')}
              className="px-4 py-2.5 bg-[#0F172A] text-white rounded-xl font-semibold text-sm hover:bg-[#1E293B] transition"
            >
              Alleen noodzakelijk
            </button>
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-[#0F172A] font-medium text-sm transition"
            >
              <Settings className="w-4 h-4" />
              {showDetails ? 'Minder opties' : 'Voorkeuren'}
            </button>
            <Link
              to="/privacy"
              className="ml-auto text-sm text-slate-500 hover:text-[#4FA151] transition"
            >
              Privacybeleid
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
