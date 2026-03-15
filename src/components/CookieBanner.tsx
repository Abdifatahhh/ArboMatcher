import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings } from 'lucide-react';

const STORAGE_KEY = 'arbomatcher_cookie_consent';

type Consent = 'all' | 'necessary' | 'custom' | null;

export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Consent | null;
    return !stored;
  });
  const [showDetails, setShowDetails] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);

  useEffect(() => {
    document.body.classList.remove('cookie-banner-reserved');
  }, []);

  useEffect(() => {
    if (!visible) return;
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setReadyToShow(true);
      window.removeEventListener('pointerdown', show);
      window.removeEventListener('keydown', show);
      window.removeEventListener('touchstart', show);
      window.removeEventListener('scroll', show);
    };
    window.addEventListener('pointerdown', show, { once: true, passive: true });
    window.addEventListener('keydown', show, { once: true });
    window.addEventListener('touchstart', show, { once: true, passive: true });
    window.addEventListener('scroll', show, { once: true, passive: true });
    const fallbackId = window.setTimeout(show, 12000);
    return () => {
      window.clearTimeout(fallbackId);
      window.removeEventListener('pointerdown', show);
      window.removeEventListener('keydown', show);
      window.removeEventListener('touchstart', show);
      window.removeEventListener('scroll', show);
    };
  }, [visible]);

  const save = (value: Consent) => {
    localStorage.setItem(STORAGE_KEY, value ?? 'necessary');
    setVisible(false);
    setShowDetails(false);
  };

  if (!visible || !readyToShow) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#0F172A] mb-1">Cookies & privacy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Wij gebruiken cookies voor het functioneren van de site, om het gebruik te analyseren en om uw voorkeuren
                te onthouden. Met <span className="font-semibold">“Alles accepteren”</span> geeft u toestemming voor alle
                onderstaande categorieën. Met <span className="font-semibold">“Alleen noodzakelijk”</span> plaatsen we
                alleen de cookies die nodig zijn om de site te laten werken. Lees meer in ons{' '}
                <Link to="/privacy" className="text-[#0F172A] font-medium hover:underline">privacybeleid</Link>.
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-600">
              <p className="text-xs text-slate-500 mb-1">
                Hier ziet u precies welke soorten cookies we gebruiken:
              </p>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked disabled className="rounded border-slate-300 text-[#0F172A]" />
                <span><span className="font-semibold">Noodzakelijk</span> – vereist voor de basiswerking van de site (altijd aan)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0F172A]" />
                <span><span className="font-semibold">Analytisch</span> – helpt ons het gebruik en prestaties te meten</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-[#0F172A]" />
                <span><span className="font-semibold">Voorkeuren</span> – onthoudt uw keuzes, zoals taal en instellingen</span>
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => save('all')}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
            >
              Alles accepteren
            </button>
            <button
              onClick={() => save('necessary')}
              className="px-4 py-2.5 border border-emerald-200 text-[#0F172A] rounded-xl font-semibold text-sm hover:bg-emerald-50 transition"
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
              className="ml-auto text-sm text-slate-500 hover:text-[#0F172A] transition"
            >
              Privacybeleid
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
