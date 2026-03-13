import { Search, Mail, User, Send, Briefcase, MapPin, Clock } from 'lucide-react';

const DUMMY_JOBS = [
  { id: 1, title: 'Bedrijfsarts verzuimbegeleiding', location: 'Amsterdam', time: '5 minuten geleden', tag: 'Marktconform' },
  { id: 2, title: 'Arbo-arts (0,5 fte)', location: 'Utrecht', time: '20 minuten geleden', tag: 'BIG' },
  { id: 3, title: 'Bedrijfsarts PMO en re-integratie', location: 'Rotterdam', time: '1 uur geleden', tag: 'Flexibel' },
  { id: 4, title: 'Arbo-professional detachering', location: 'Den Haag', time: '2 uur geleden', tag: 'Langere inzet' },
];

const FILTER_TAGS = ['Verzuim', 'PMO', 'Noord-Holland'];

export interface HowItWorksPreviewProps {
  activeStep: number;
}

export function HowItWorksPreview({ activeStep }: HowItWorksPreviewProps) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={`Preview stap ${activeStep}`}
    >
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
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
        <Briefcase className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Alle opdrachten op één plek</span>
      </div>
      <div className="space-y-3">
        {['Verzuimbegeleiding', 'PMO & preventie', 'Re-integratie', 'Verzekeringsgeneeskunde'].map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-200/60 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-700 font-bold text-sm">{i + 1}</span>
            </div>
            <span className="text-[#0F172A] font-medium">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Opdrachten van organisaties in één overzicht.
      </p>
    </div>
  );
}

function PreviewStep2() {
  return (
    <div className="p-6 sm:p-8">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Zoek op specialisatie, regio of contractvorm"
          readOnly
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[#0F172A] placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          aria-label="Zoekopdrachten"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTER_TAGS.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] text-white text-xs font-medium"
          >
            {tag}
            <span className="opacity-70" aria-hidden>×</span>
          </span>
        ))}
      </div>
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {DUMMY_JOBS.map((job) => (
          <div
            key={job.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#0F172A] text-sm truncate">{job.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.time}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0">
              {job.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewStep3() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Opdrachten in je inbox</span>
      </div>
      <div className="space-y-2">
        {[
          { from: 'ArboMatcher', subject: 'Nieuwe opdracht: Bedrijfsarts Amsterdam', time: 'Vandaag 09:42', unread: true },
          { from: 'ArboMatcher', subject: 'Match: PMO-opdracht Utrecht', time: 'Gisteren 14:20', unread: false },
          { from: 'ArboMatcher', subject: 'Reminder: 3 opdrachten passen bij je profiel', time: 'Ma 11:00', unread: false },
        ].map((mail, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl border transition-colors ${
              mail.unread ? 'bg-blue-50/40 border-blue-100' : 'bg-slate-50/50 border-slate-100'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#0F172A] flex-shrink-0" style={{ opacity: mail.unread ? 1 : 0 }} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#0F172A] text-sm truncate">{mail.subject}</p>
              <p className="text-xs text-slate-500">{mail.from} · {mail.time}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Ontvang alleen opdrachten die aansluiten op je specialismen en regio.
      </p>
    </div>
  );
}

function PreviewStep4() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Verrijk je profiel</span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Specialismen</label>
          <div className="flex flex-wrap gap-2">
            {['Verzuim', 'PMO', 'Re-integratie'].map((s) => (
              <span key={s} className="px-2.5 py-1 bg-slate-200/60 text-slate-700 rounded-lg text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Regio's</label>
          <p className="text-sm text-[#0F172A]">Noord-Holland, Zuid-Holland</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">BIG-nummer</label>
          <p className="text-sm text-[#0F172A] font-medium">Geverifieerd</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Een compleet profiel vergroot je zichtbaarheid bij organisaties.
      </p>
    </div>
  );
}

function PreviewStep5() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-[#0F172A]">Reageer snel en eenvoudig</span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 mb-4">
        <p className="text-sm font-medium text-[#0F172A] mb-2">Bedrijfsarts verzuimbegeleiding · Amsterdam</p>
        <textarea
          readOnly
          rows={3}
          placeholder="Schrijf een korte motivatie..."
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 resize-none focus:outline-none"
          aria-label="Motivatie"
        />
        <button
          type="button"
          className="mt-3 w-full py-2.5 bg-[#0F172A] text-white rounded-xl font-semibold text-sm hover:bg-[#1E293B] transition-colors"
        >
          Reactie versturen
        </button>
      </div>
      <p className="text-sm text-slate-500">
        Eén klik om te reageren. Opdrachtgevers ontvangen je reactie direct.
      </p>
    </div>
  );
}
