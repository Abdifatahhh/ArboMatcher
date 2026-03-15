import { CheckCircle2, Stethoscope, ShieldCheck, Sparkles } from 'lucide-react';

const PROFESSIONALS = [
  'Bedrijfsarts',
  'Arbo-arts',
  'Verzekeringsarts',
  'Praktijkondersteuner bedrijfsarts (POB)',
  'Casemanager verzuim',
];

export function ProfessionalsListSection() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 relative overflow-hidden">
      <div className="absolute -top-24 -right-20 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-100/40 rounded-full blur-3xl" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-3">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Beschikbare professionals</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Onze professionals</h3>
              <p className="text-slate-500 mt-2">Vind snel de juiste expertise voor verzuim, preventie en re-integratie.</p>
            </div>

            <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 self-start sm:self-center">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-semibold">BIG-verifieerd</span>
            </div>
          </div>

          <div className="space-y-3">
            {PROFESSIONALS.map((item, index) => (
              <div
                key={item}
                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 px-4 py-4 sm:px-5 sm:py-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-[#0F172A] font-medium text-lg sm:text-xl flex-1">{item}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 text-slate-500 text-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Profielen worden actief gematcht op regio, beschikbaarheid en expertise.
          </div>
        </div>
      </div>
    </section>
  );
}
