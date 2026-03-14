import {
  Users,
  FileText,
  CheckCircle,
  UserCheck,
  Handshake,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

const DUMMY_ARTISTS = [
  { name: 'Dr. Anna de Vries', specialism: 'Verzuim & re-integratie', region: 'Noord-Holland', verified: true },
  { name: 'Dr. Pieter Jansen', specialism: 'PMO & preventie', region: 'Zuid-Holland', verified: true },
  { name: 'Dr. Lisa van den Berg', specialism: 'Verzuimbegeleiding', region: 'Utrecht', verified: true },
];

export interface HowItWorksPreviewOpdrachtgeversProps {
  activeStep: number;
}

export function HowItWorksPreviewOpdrachtgevers({ activeStep }: HowItWorksPreviewOpdrachtgeversProps) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={`Preview stap organisaties ${activeStep}`}
    >
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
        {activeStep === 1 && <PreviewStep1 />}
        {activeStep === 2 && <PreviewStep2 />}
        {activeStep === 3 && <PreviewStep3 />}
        {activeStep === 4 && <PreviewStep4 />}
        {activeStep === 5 && <PreviewStep5 />}
      </div>
    </div>
  );
}

function PreviewStep1() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Groot aanbod van professionals</span>
      </div>
      <div className="space-y-3">
        {DUMMY_ARTISTS.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-emerald-50/40 hover:border-emerald-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-700 font-bold text-sm">{a.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#0F172A] text-sm">{a.name}</p>
              <p className="text-xs text-slate-500">{a.specialism} · {a.region}</p>
            </div>
            {a.verified && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" />
                BIG
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Filter op specialisme, regio en beschikbaarheid om de juiste match te vinden.
      </p>
    </div>
  );
}

function PreviewStep2() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Nieuwe opdracht plaatsen</span>
      </div>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Kwaliteitscore</span>
          <span className="text-sm font-semibold text-[#0F172A]">80%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
            style={{ width: '80%' }}
          />
        </div>
      </div>
      <div className="space-y-3">
        {[
          { done: true, label: 'Titel en beschrijving opdracht' },
          { done: false, label: 'Eisen en gewenste startdatum' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            {item.done ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-600">
                2
              </div>
            )}
            <span className={item.done ? 'text-slate-500 line-through text-sm' : 'text-[#0F172A] font-medium text-sm'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Vul de velden in en ontvang reacties van professionals die bij uw opdracht passen.
      </p>
    </div>
  );
}

function PreviewStep3() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Kandidaten ontvangen</span>
      </div>
      <div className="space-y-2">
        {[
          { name: 'Dr. Anna de Vries', time: 'Vandaag 10:32', new: true },
          { name: 'Dr. Pieter Jansen', time: 'Vandaag 09:15', new: true },
          { name: 'Dr. Lisa van den Berg', time: 'Gisteren 16:45', new: false },
        ].map((c, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl border transition-colors ${
              c.new ? 'bg-emerald-50/40 border-emerald-100' : 'bg-slate-50/50 border-slate-100'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#0F172A] flex-shrink-0" style={{ opacity: c.new ? 1 : 0 }} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#0F172A] text-sm">{c.name}</p>
              <p className="text-xs text-slate-500">heeft gereageerd · {c.time}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Meestal binnen 48 uur meerdere reacties van BIG-geregistreerde professionals.
      </p>
    </div>
  );
}

function PreviewStep4() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Selectie maken</span>
      </div>
      <div className="space-y-3">
        {['Op shortlist', 'Uitgenodigd voor gesprek', 'Geselecteerd'].map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 px-4 rounded-xl border border-slate-100 bg-slate-50/50"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-200/60 flex items-center justify-center text-slate-700 font-bold text-sm">
              {i + 1}
            </span>
            <span className="text-[#0F172A] font-medium text-sm">{label}</span>
            {i === 2 && (
              <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Vergelijk profielen en nodig kandidaten uit. Kies de arts die het beste past.
      </p>
    </div>
  );
}

function PreviewStep5() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Handshake className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Samen aan het werk</span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-sm font-medium text-[#0F172A]">Startdatum en uren afgesproken</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-sm font-medium text-[#0F172A]">Contractvorm vastgelegd</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-sm font-medium text-[#0F172A]">Professional kan direct starten</span>
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Maak onderling afspraken over facturatie en inzet. De professional is klaar om bij u aan de slag te gaan.
      </p>
    </div>
  );
}
