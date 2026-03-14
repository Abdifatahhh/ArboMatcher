import { useState, useEffect } from 'react';
import type { ConsentPreferences } from '../lib/types';

export const CONSENT_KEYS: (keyof Omit<ConsentPreferences, 'main'>)[] = [
  'inform_candidate',
  'share_profile_cv',
  'products_services',
  'share_sister_companies',
  'newsletter',
  'feedback_reviews',
  'relevant_content',
];

export const EXTENDED_SETTINGS = [
  'Om organisaties over u als mogelijke kandidaat te informeren wanneer uw profiel matcht op een opdracht, zonder daarbij uw voor- en achternaam te tonen.',
  'Om uw profiel en cv te delen met organisaties wanneer u matcht op een opdracht.',
  'Om u te informeren over huidige en toekomstige producten of diensten van ArboMatcher of derden en om deelname mogelijk te maken aan eventuele acties.',
  'Om te delen met moeder- en/of zusterbedrijven van ArboMatcher.',
  'Om u periodiek de nieuwsbrief van ArboMatcher toe te sturen.',
  'Om u per e-mail te vragen naar feedback en reviews ter onderzoek en verbetering van ArboMatcher.',
  'Om u functionele en professioneel relevante content (zoals bijv. whitepapers en how-to\'s) toe te sturen.',
] as const;

interface PrivacyConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  toggles: boolean[];
  onTogglesChange: (toggles: boolean[]) => void;
}

export function PrivacyConsent({ checked, onChange, toggles, onTogglesChange }: PrivacyConsentProps) {
  const [showExtended, setShowExtended] = useState(false);

  useEffect(() => {
    if (checked) onTogglesChange(EXTENDED_SETTINGS.map(() => true));
    else onTogglesChange(EXTENDED_SETTINGS.map(() => false));
  }, [checked, onTogglesChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const setToggle = (index: number, value: boolean) => {
    const next = [...toggles];
    next[index] = value;
    onTogglesChange(next);
  };

  return (
    <>
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
              checked
                ? 'bg-emerald-500 border-emerald-500'
                : 'bg-white border-slate-300 group-hover:border-emerald-400'
            }`}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className="text-sm text-[#0F172A]">
            Ik ga akkoord met de verwerking van mijn persoonsgegevens
            <br />
            <span className="text-[#0F172A]">voor de vermelde doeleinden.</span>
          </span>
        </label>
        <button
          type="button"
          onClick={() => setShowExtended(true)}
          className="text-sm font-medium text-[#0F172A] hover:text-slate-700 hover:underline ml-7"
        >
          Uitgebreide instellingen
        </button>
      </div>

      {showExtended && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40" onClick={() => setShowExtended(false)}>
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-[#0F172A] text-lg">Uitgebreide instellingen</h3>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
              {EXTENDED_SETTINGS.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={toggles[i]}
                    onClick={() => setToggle(i, !toggles[i])}
                    className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors flex items-center ${
                      toggles[i] ? 'bg-emerald-500 justify-end' : 'bg-slate-100 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 bg-white rounded-full shadow mx-0.5" />
                  </button>
                  <p className="text-sm text-[#0F172A] bg-slate-100 rounded-lg px-3 py-2 flex-1">{text}</p>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExtended(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
              >
                Instellingen opslaan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
