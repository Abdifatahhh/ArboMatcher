import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import { faqGroups } from '../data/faq';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all ${open ? 'ring-1 ring-slate-200' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-slate-50/50 transition rounded-xl"
      >
        <span className="font-semibold text-[#0F172A] pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />}
      </button>
      {open && (
        <div className="pb-4 px-4">
          <p className="text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-slate-400" />
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Veelgestelde vragen</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Antwoorden op de meest gestelde vragen over het platform, abonnementen en het matchen van opdrachten en professionals.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqGroups.map((group) => (
            <div key={group.title} className="mb-12">
              {group.title === 'Platform' ? (
                <div className="mb-4 pb-2 border-b-2 border-slate-200">
                  <LogoText theme="light" className="text-xl" />
                </div>
              ) : (
                <h2 className="text-xl font-bold text-[#0F172A] mb-4 pb-2 border-b-2 border-slate-200">
                  {group.title}
                </h2>
              )}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                {group.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 mb-4">Niet gevonden wat u zocht?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
            >
              Neem contact op
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
