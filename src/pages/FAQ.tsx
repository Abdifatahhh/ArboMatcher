import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import { faqGroups } from '../data/faq';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50/50 transition rounded-lg px-1 -mx-1"
      >
        <span className="font-semibold text-[#0F172A] pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="pb-4 pl-0 pr-4">
          <p className="text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-[#4FA151]" />
            <span className="text-[#4FA151] font-semibold text-sm uppercase tracking-wider">Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Veelgestelde vragen</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Antwoorden op de meest gestelde vragen over het platform, abonnementen en het matchen van opdrachten en professionals.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqGroups.map((group) => (
            <div key={group.title} className="mb-12">
              {group.title === 'Platform' ? (
                <div className="mb-4 pb-2 border-b-2 border-[#4FA151]/30">
                  <LogoText theme="light" className="text-xl" />
                </div>
              ) : (
                <h2 className="text-xl font-bold text-[#0F172A] mb-4 pb-2 border-b-2 border-[#4FA151]/30">
                  {group.title}
                </h2>
              )}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div key={item.q} className="px-6">
                      <FaqItem q={item.q} a={item.a} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-12 text-center p-6 bg-[#F4FAF4] rounded-2xl border border-[#4FA151]/15">
            <p className="text-slate-600 mb-4">Niet gevonden wat u zocht?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
            >
              Neem contact op
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
