import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Application, Job } from '../../lib/types';
import { Send, Clock, MapPin, Building2, FileText, Eye, MessageSquare, ChevronDown, CheckCircle } from 'lucide-react';

interface ApplicationWithJob extends Application {
  jobs: Job;
}

type StatusFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SHORTLISTED';
type JobStatusFilter = 'ALL' | 'PUBLISHED' | 'CLOSED';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Alle statussen' },
  { value: 'PENDING', label: 'In behandeling' },
  { value: 'ACCEPTED', label: 'Geaccepteerd' },
  { value: 'REJECTED', label: 'Afgewezen' },
  { value: 'SHORTLISTED', label: 'Shortlist' },
];

const JOB_STATUS_OPTIONS: { value: JobStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Alle opdrachten' },
  { value: 'PUBLISHED', label: 'Open' },
  { value: 'CLOSED', label: 'Gesloten' },
];

function FilterSelect({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-emerald-300 transition shadow-sm">
        {current?.label} <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1">
          {options.map(o => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition ${o.value === value ? 'text-emerald-600 font-medium' : 'text-slate-600'}`}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArtsReacties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [jobStatusFilter, setJobStatusFilter] = useState<JobStatusFilter>('ALL');

  useEffect(() => { fetchApplications(); }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    const { data: professional } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
    if (!professional) { setLoading(false); return; }
    const { data } = await supabase.from('applications').select('*, jobs(*)').eq('professional_id', professional.id).order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setApplications(data as ApplicationWithJob[]);
      setLoading(false);
    } else {
      const { data: realJobs } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').limit(4);
      if (realJobs && realJobs.length > 0) {
        const statuses: Application['status'][] = ['PENDING', 'REJECTED', 'REJECTED', 'PENDING'];
        const demo = realJobs.map((job, i) => ({
          id: `demo-${i}`,
          job_id: job.id,
          professional_id: 'demo',
          message: null,
          attachment_url: null,
          status: statuses[i % statuses.length],
          status_changed_at: null,
          viewed_at: null,
          cv_downloaded: false,
          created_at: job.created_at,
          updated_at: job.created_at,
          jobs: job as Job,
        })) as ApplicationWithJob[];
        setApplications(demo);
      }
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return { text: 'Geaccepteerd', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
      case 'REJECTED': return { text: 'Afgewezen', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
      case 'SHORTLISTED': return { text: 'Shortlist', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
      default: return { text: 'Open', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
    }
  };

  const filtered = applications.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (jobStatusFilter === 'PUBLISHED' && a.jobs?.status !== 'PUBLISHED') return false;
    if (jobStatusFilter === 'CLOSED' && a.jobs?.status === 'PUBLISHED') return false;
    return true;
  });

  const fmt = (d: string) => new Date(d).toLocaleString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Verstuurde reacties</h1>
        <p className="text-sm text-slate-400 mt-0.5">{filtered.length} resultaten gevonden</p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <FilterSelect options={STATUS_OPTIONS} value={statusFilter} onChange={(v) => setStatusFilter(v as StatusFilter)} />
        <FilterSelect options={JOB_STATUS_OPTIONS} value={jobStatusFilter} onChange={(v) => setJobStatusFilter(v as JobStatusFilter)} />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Nog geen reacties verstuurd</h3>
          <p className="text-slate-400 mb-6 text-sm">Begin met reageren op opdrachten om hier uw reacties te zien</p>
          <Link
            to="/professional/opdrachten"
            className="inline-block bg-gradient-to-r from-emerald-600 to-green-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:from-emerald-700 hover:to-green-600 transition shadow-md"
          >
            Bekijk opdrachten
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((application) => {
            const status = getStatusLabel(application.status);
            const job = application.jobs;
            const isOpen = job?.status === 'PUBLISHED';

            return (
              <div
                key={application.id}
                onClick={() => navigate(`/professional/reacties/${application.id}`)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col cursor-pointer group"
              >
                <div className="p-4 flex-1">
                  {/* Header: icon + status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${status.color}`}>
                      {status.text}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-emerald-700 transition">
                    {job?.title}
                  </h3>

                  {/* Company */}
                  {job?.company_name && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{job.company_name}</span>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>Gereageerd op {fmt(application.created_at)}</span>
                    </div>
                    {job?.region && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{job.region}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3 h-3 flex-shrink-0" />
                      <span>Bekeken op {fmt(application.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 flex-shrink-0" />
                      <span>Cv nog niet gedownload</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 flex-shrink-0" />
                      <span>Geen nieuwe berichten</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-1.5">
                  <CheckCircle className={`w-3 h-3 ${isOpen ? 'text-emerald-500' : 'text-red-400'}`} />
                  <span className="text-[11px] text-slate-400">
                    Deze opdracht is <span className={`font-semibold ${isOpen ? 'text-emerald-600' : 'text-red-500'}`}>{isOpen ? 'open' : 'gesloten'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
