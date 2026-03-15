import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Application, Job } from '../../lib/types';
import { ArrowLeft, HelpCircle, Eye, MessageSquare, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { getContractFormLabel } from '../../lib/opdrachtConstants';
import ApplicationChat from '../../components/ApplicationChat';

interface ApplicationWithJob extends Application {
  jobs: Job;
}

type Tab = 'reactie' | 'opdracht' | 'historie';

export default function ReactieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState<ApplicationWithJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('reactie');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const top = containerRef.current.getBoundingClientRect().top;
        setContainerH(window.innerHeight - top);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [loading]);

  useEffect(() => { fetchApplication(); }, [id, user]);

  const fetchApplication = async () => {
    if (!user || !id) return;

    if (id.startsWith('demo-')) {
      const { data: jobs } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').limit(4);
      const idx = parseInt(id.replace('demo-', ''));
      const job = jobs?.[idx];
      if (job) {
        const statuses: Application['status'][] = ['PENDING', 'REJECTED', 'REJECTED', 'PENDING'];
        const created = new Date(job.created_at);
        const viewedDate = new Date(created.getTime() + 60000);
        const changedDate = new Date(created.getTime() + 2 * 86400000);
        const demoDescription = `Wij zoeken een ervaren en proactieve bedrijfsarts die graag afwisselend bezig is met zowel verzuimbegeleiding als preventieve zorg. Iemand die het werk ziet liggen, verantwoordelijkheid neemt en zelfstandig kan werken, maar niet solistisch opereert.

U vangt het merendeel van de arbovragen af en schakelt met collega's wanneer vraagstukken specialistisch of bedrijfskritisch worden. U werkt binnen afgesproken protocollen en stemt wijzigingen altijd af.

Wat ga je doen?

Uw werkzaamheden zijn afwisselend en hands-on:

• Uitvoeren van verzuimspreekuren en sociaal-medische beoordelingen
• Adviseren van werkgevers over re-integratie en arbeidsomstandigheden
• Begeleiden van langdurig verzuim en opstellen van probleemanalyses
• Uitvoeren van preventief medisch onderzoek (PMO)
• Beoordelen van arbeidsgezondheidskundige vraagstukken
• Samenwerken met casemanagers, HR en leidinggevenden
• Bijdragen aan het arbobeleid en preventieactiviteiten
• Opbouwen en onderhouden van medische dossiers

Wat breng je mee?

• BIG-registratie als arts, bij voorkeur met registratie als bedrijfsarts
• Aantoonbare ervaring in de arbeidsgeneeskunde of verzuimbegeleiding
• U werkt proactief: u wacht niet af, maar pakt zaken op
• U kunt zelfstandig werken, maar weet wanneer escalatie of overleg nodig is
• Kennis van relevante wet- en regelgeving (Wet verbetering poortwachter, WIA)
• Ervaring met sociaal-medische beoordelingen en belastbaarheidsprofiel
• Goede communicatieve vaardigheden richting werkgevers en werknemers

Wie ben jij?

• Praktisch, nuchter en oplossingsgericht
• Ziet werk liggen en pakt het op
• Empathisch maar zakelijk waar nodig
• Werkt volgens afgesproken protocollen en richtlijnen
• Communicatief vaardig richting alle betrokkenen
• Rustig onder druk, ook bij complexe casussen
• Bereid om te leren en verantwoordelijkheid te nemen`;

        const enrichedJob = { ...job, description: job.description || demoDescription };
        setApplication({
          id, job_id: job.id, professional_id: 'demo',
          message: 'Met mijn ervaring als bedrijfsarts sluit ik goed aan bij deze opdracht. Ik heb ruime ervaring met verzuimbegeleiding en re-integratie en werk graag in een multidisciplinair team.',
          attachment_url: null,
          status: statuses[idx % statuses.length],
          status_changed_at: changedDate.toISOString(),
          viewed_at: viewedDate.toISOString(),
          cv_downloaded: false,
          created_at: job.created_at,
          updated_at: changedDate.toISOString(),
          jobs: enrichedJob as Job,
        } as ApplicationWithJob);
      }
      setLoading(false);
      return;
    }

    const { data: professional } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
    if (!professional) { setLoading(false); return; }
    const { data } = await supabase.from('applications').select('*, jobs(*)').eq('id', id).eq('professional_id', professional.id).maybeSingle();
    if (data) setApplication(data as ApplicationWithJob);
    setLoading(false);
  };

  const getStatus = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return { text: 'Geaccepteerd', color: 'bg-green-100 text-green-700', icon: CheckCircle, accent: 'border-green-200' };
      case 'REJECTED': return { text: 'Afgewezen', color: 'bg-red-100 text-red-700', icon: XCircle, accent: 'border-red-200' };
      case 'SHORTLISTED': return { text: 'Shortlist', color: 'bg-blue-100 text-blue-700', icon: CheckCircle, accent: 'border-blue-200' };
      default: return { text: 'In behandeling', color: 'bg-amber-100 text-amber-700', icon: Clock, accent: 'border-amber-200' };
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" /></div>;
  }

  if (!application) {
    return <div className="p-6 text-center text-slate-500">Reactie niet gevonden</div>;
  }

  const status = getStatus(application.status);
  const StatusIcon = status.icon;
  const job = application.jobs;
  const fmt = (d: string | null) => d ? new Date(d).toLocaleString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div ref={containerRef} className="flex overflow-hidden" style={containerH ? { height: containerH } : undefined}>
      {/* Left: scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/professional/reacties" className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-medium">Verstuurde reacties</p>
          <h1 className="text-lg font-bold text-slate-800 truncate">{job?.title}</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color} flex items-center gap-1.5 flex-shrink-0`}>
          <StatusIcon className="w-3.5 h-3.5" />{status.text}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
        {([['reactie', 'Mijn reactie'], ['opdracht', 'Opdracht details'], ['historie', 'Statushistorie']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${tab === key ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* TAB: Mijn reactie */}
      {tab === 'reactie' && (
        <div className="space-y-5">
          {/* Details card */}
          <div className={`bg-white rounded-xl border ${status.accent} shadow-sm p-5`}>
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-emerald-500" /> Details
            </h2>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="text-slate-400 pr-6 py-1.5 whitespace-nowrap align-middle">Reactiestatus</td>
                  <td className="py-1.5 align-middle"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>{status.text}</span></td>
                </tr>
                <tr>
                  <td className="text-slate-400 pr-6 py-1.5 whitespace-nowrap">Ingeschreven op</td>
                  <td className="text-slate-700 py-1.5 font-medium">{fmt(application.created_at)}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 pr-6 py-1.5 whitespace-nowrap">Status gewijzigd op</td>
                  <td className="text-slate-700 py-1.5 font-medium">{fmt(application.status_changed_at)}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 pr-6 py-1.5 whitespace-nowrap">Sollicitatie bekeken</td>
                  <td className="text-slate-700 py-1.5 font-medium">{application.viewed_at ? `Ja, op ${fmt(application.viewed_at)}` : 'Nee'}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 pr-6 py-1.5 whitespace-nowrap align-middle">
                    <span className="flex items-center gap-1">CV gedownload <HelpCircle className="w-3 h-3 text-slate-300" /></span>
                  </td>
                  <td className="text-slate-700 py-1.5 font-medium">{application.cv_downloaded ? 'Ja' : 'Nee'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Motivatie card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-emerald-500" /> Uw motivatie/bericht
            </h2>
            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-emerald-400">
              <p className="text-sm text-slate-600 leading-relaxed italic">{application.message || 'Geen motivatie opgegeven'}</p>
            </div>
          </div>

          {/* Opdrachtgegevens card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-emerald-500" /> Opdrachtgegevens
              </h2>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Uren per week', job?.hours_per_week ? `${job.hours_per_week} uur` : '—'],
                  ['Direct beschikbaar', 'Ja'],
                  ['Startdatum', job?.start_date ? new Date(job.start_date).toLocaleDateString('nl-NL') : 'In overleg'],
                  ['Tarief', job?.salary_indication || 'In overleg'],
                  ['Locatie', job?.region || '—'],
                  ['Looptijd', job?.duration ? `${job.duration} maanden` : '—'],
                  ['Contract', job?.job_type ? getContractFormLabel(job.job_type) : '—'],
                ].map(([label, value], i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-5 py-2.5 text-slate-400 font-medium w-1/3">{label}</td>
                    <td className="px-5 py-2.5 text-slate-700 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expertises */}
          {job?.required_expertise && (job.required_expertise as string[]).length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-emerald-500" /> Expertises
              </h2>
              <div className="flex flex-wrap gap-2">
                {(job.required_expertise as string[]).map(e => (
                  <span key={e} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200 font-medium">{e}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Opdracht details */}
      {tab === 'opdracht' && (
        <div className="space-y-5">
          {/* Header card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-lg font-bold text-slate-800">{job?.title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Geplaatst door <span className="font-semibold text-slate-700">{job?.company_name || '—'}</span> op {job?.created_at ? new Date(job.created_at).toLocaleString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
            </p>
            <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /><span className="font-medium text-slate-600">{(job as Job & { views_count?: number })?.views_count || 0}</span> keer bekeken</span>
              <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /><span className="font-medium text-slate-600">{(job as Job & { applications_count?: number })?.applications_count || 0}</span> reacties ontvangen</span>
            </div>
          </div>

          {/* Details table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Status', ''],
                  ['Referentie', (job as Job & { reference?: string })?.reference || '—'],
                  ['Uiterste reactiedatum', (job as Job & { deadline?: string })?.deadline ? new Date((job as Job & { deadline?: string }).deadline!).toLocaleDateString('nl-NL') : '—'],
                  ['Locatie', job?.region || '—'],
                  ['Werken op locatie', job?.remote_type === 'ON_SITE' ? 'Ja' : job?.remote_type === 'REMOTE' ? 'Nee' : 'Hybride'],
                  ['Startdatum', job?.start_date ? new Date(job.start_date).toLocaleDateString('nl-NL') : 'Zo snel mogelijk starten'],
                  ['Duur van de opdracht', job?.duration ? `${job.duration} maanden` : '—'],
                  ['Aantal uur per week', job?.hours_per_week ? `${job.hours_per_week} uur per week` : '—'],
                  ['Tarief', job?.salary_indication || 'In overleg'],
                  ['Contract', job?.job_type ? getContractFormLabel(job.job_type) : '—'],
                ].map(([label, value], i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3 text-slate-400 font-medium whitespace-nowrap w-1/3">{label}</td>
                    <td className="px-5 py-3 text-slate-700 font-medium">
                      {label === 'Status' ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job?.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {job?.status === 'PUBLISHED' ? 'Gepubliceerd' : 'Gesloten'}
                        </span>
                      ) : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Beschrijving */}
          {job?.description && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-emerald-500" /> Opdrachtomschrijving
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Statushistorie */}
      {tab === 'historie' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-emerald-500" /> Tijdlijn
            </h2>
            <div className="space-y-0">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><Send className="w-4 h-4 text-emerald-600" /></div>
                  <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                </div>
                <div className="pb-5">
                  <p className="text-sm font-semibold text-slate-700">Reactie verstuurd</p>
                  <p className="text-xs text-slate-400 mt-0.5">{fmt(application.created_at)}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">In behandeling</span>
                </div>
              </div>

              {application.viewed_at && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Eye className="w-4 h-4 text-blue-600" /></div>
                    <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-semibold text-slate-700">Sollicitatie bekeken door organisatie</p>
                    <p className="text-xs text-slate-400 mt-0.5">{fmt(application.viewed_at)}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">Bekeken</span>
                  </div>
                </div>
              )}

              {application.status_changed_at && application.status !== 'PENDING' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${application.status === 'ACCEPTED' ? 'bg-green-100' : application.status === 'REJECTED' ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <StatusIcon className={`w-4 h-4 ${application.status === 'ACCEPTED' ? 'text-green-600' : application.status === 'REJECTED' ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-semibold text-slate-700">Status gewijzigd naar {status.text.toLowerCase()}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{fmt(application.status_changed_at)}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${status.color}`}>{status.text}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      </div>{/* end left scrollable */}

      {/* Right: chat full height */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 border-l border-slate-200">
        <div className="flex-1 flex flex-col">
          <ApplicationChat
            applicationId={application.id}
            jobTitle={job?.title || ''}
            companyName={job?.company_name || ''}
            contactName={job?.company_name}
            jobStatus={job?.status}
            statusChangedAt={application.status_changed_at}
            currentStatus={application.status}
          />
        </div>
      </div>
    </div>
  );
}
