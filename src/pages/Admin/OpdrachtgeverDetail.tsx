import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getClientById, updateClient, toggleClientBlocked, listClientJobs } from '../../services/adminClientsService';
import type { AdminClientRow, JobWithMeta } from '../../services/adminClientsService';
import { demoOpdrachtgevers, demoJobs } from '../../data/adminDemoData';
import { Save, Ban, CheckCircle, Briefcase, Building2 } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminCard, AdminAlert, AdminBadge, AdminLoadingState, AdminPagination } from '../../components/Admin/adminUI';
import { AdminBreadcrumbs } from '../../components/Admin/AdminBreadcrumbs';

const JOBS_PAGE_SIZE = 10;
const fi = 'w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition';
const fd = 'w-full h-10 px-3 border border-slate-100 rounded-lg text-sm text-slate-500 bg-slate-50';
const fl = 'block text-sm font-medium text-slate-700 mb-1.5';

export default function AdminOpdrachtgeverDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editMode = searchParams.get('edit') === '1';
  const [row, setRow] = useState<AdminClientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [jobs, setJobs] = useState<JobWithMeta[]>([]);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [jobsPage, setJobsPage] = useState(1);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    if (id.startsWith('demo-')) {
      const demoRow = demoOpdrachtgevers.find((r) => r.employer.id === id);
      if (demoRow) { setRow(demoRow as AdminClientRow); setIsDemo(true); setEditCompanyName(demoRow.employer.company_name); setEditFullName(demoRow.profile.full_name ?? ''); setEditPhone(demoRow.profile.phone ?? ''); }
      else { setRow(null); setIsDemo(false); }
      setLoading(false);
    } else {
      getClientById(id).then((r) => { setRow(r); setIsDemo(false); if (r) { setEditCompanyName(r.employer.company_name); setEditFullName(r.profile.full_name ?? ''); setEditPhone(r.profile.phone ?? ''); } setLoading(false); });
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (id.startsWith('demo-')) {
      const dj = demoJobs.filter((j) => j.employer_id === id);
      setJobsTotal(dj.length);
      const from = (jobsPage - 1) * JOBS_PAGE_SIZE;
      setJobs(dj.slice(from, from + JOBS_PAGE_SIZE) as JobWithMeta[]);
    } else {
      listClientJobs(id, { page: jobsPage, pageSize: JOBS_PAGE_SIZE }).then((res) => { setJobs(res.data); setJobsTotal(res.total); });
    }
  }, [id, jobsPage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !row) return;
    if (isDemo) { setMessage({ type: 'error', text: 'Demo-data kan niet worden opgeslagen.' }); return; }
    setSaving(true); setMessage(null);
    const { error } = await updateClient(id, { company_name: editCompanyName, full_name: editFullName || null, phone: editPhone || null });
    if (error) { setMessage({ type: 'error', text: 'Opslaan mislukt.' }); }
    else { setMessage({ type: 'success', text: 'Opgeslagen.' }); const updated = await getClientById(id); if (updated) setRow(updated); }
    setSaving(false);
  };

  const handleToggleBlock = async () => {
    if (!id || !row || isDemo) return;
    const { error } = await toggleClientBlocked(id);
    if (!error) { const updated = await getClientById(id); if (updated) setRow(updated); }
  };

  if (loading) return <AdminPage><AdminLoadingState rows={6} /></AdminPage>;

  if (!row) {
    return (
      <AdminPage>
        <AdminAlert variant="error">Opdrachtgever niet gevonden.</AdminAlert>
        <Link to="/admin/organisaties" className="text-sm text-blue-600 hover:underline mt-2 inline-block">Terug naar organisaties</Link>
      </AdminPage>
    );
  }

  const { employer, profile, jobs_count } = row;
  const isBlocked = profile.status === 'BLOCKED';
  const jobsFrom = jobsTotal === 0 ? 0 : (jobsPage - 1) * JOBS_PAGE_SIZE + 1;
  const jobsTo = Math.min(jobsPage * JOBS_PAGE_SIZE, jobsTotal);
  const jobsTotalPages = Math.max(1, Math.ceil(jobsTotal / JOBS_PAGE_SIZE));

  return (
    <AdminPage className="max-w-4xl">
      <AdminBreadcrumbs items={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Organisaties', to: '/admin/organisaties' },
        { label: employer.company_name || 'Detail' },
      ]} />

      <AdminPageHeader
        icon={Building2}
        title={employer.company_name || 'Opdrachtgever'}
        description={profile.email}
        actions={
          <div className="flex items-center gap-2">
            <AdminBadge variant={isBlocked ? 'danger' : 'success'} dot>{isBlocked ? 'Geblokkeerd' : 'Actief'}</AdminBadge>
          </div>
        }
      />

      {isDemo && <AdminAlert variant="warning">Dit is een demo-organisatie. Wijzigingen worden niet opgeslagen.</AdminAlert>}
      {message && <AdminAlert variant={message.type === 'success' ? 'success' : 'error'} onClose={() => setMessage(null)}>{message.text}</AdminAlert>}

      <AdminCard title="Gegevens">
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div><label className={fl}>Bedrijfsnaam</label><input type="text" value={editCompanyName} onChange={(e) => setEditCompanyName(e.target.value)} className={fi} /></div>
            <div><label className={fl}>Contactpersoon</label><input type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className={fi} /></div>
            <div><label className={fl}>E-mail</label><input type="email" value={profile.email} disabled className={fd} /></div>
            <div><label className={fl}>Telefoon</label><input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className={fi} /></div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition"><Save className="w-4 h-4" /> {saving ? 'Opslaan...' : 'Opslaan'}</button>
              <button type="button" onClick={() => navigate(`/admin/organisaties/${id}`, { replace: true })} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">Annuleren</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div><span className="text-slate-500">Bedrijfsnaam:</span> <span className="font-medium text-slate-900">{employer.company_name || '—'}</span></div>
              <div><span className="text-slate-500">Contactpersoon:</span> <span className="text-slate-700">{profile.full_name || '—'}</span></div>
              <div><span className="text-slate-500">E-mail:</span> <span className="text-slate-700">{profile.email}</span></div>
              <div><span className="text-slate-500">Telefoon:</span> <span className="text-slate-700">{profile.phone || '—'}</span></div>
              <div><span className="text-slate-500">Registratiedatum:</span> <span className="text-slate-700">{new Date(profile.created_at).toLocaleDateString('nl-NL')}</span></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={handleToggleBlock} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${isBlocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                {isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                {isBlocked ? 'Deblokkeren' : 'Blokkeren'}
              </button>
              <Link to={`/admin/organisaties/${id}?edit=1`} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Bewerken</Link>
            </div>
          </div>
        )}
      </AdminCard>

      <AdminCard title={`Opdrachten (${jobs_count})`} actions={<Briefcase className="w-4 h-4 text-slate-400" />}>
        {jobs.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">Geen opdrachten.</p>
        ) : (
          <div className="divide-y divide-slate-50 -mx-5">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between px-5 py-2.5">
                <div>
                  <Link to="/admin/opdrachten" className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">{job.title}</Link>
                  <span className="ml-2 text-xs text-slate-400">{job.status} · {new Date(job.created_at).toLocaleDateString('nl-NL')}</span>
                </div>
                <Link to={`/opdrachten/${job.id}`} className="text-xs text-blue-600 hover:underline">Bekijk</Link>
              </div>
            ))}
          </div>
        )}
        {jobsTotal > JOBS_PAGE_SIZE && (
          <AdminPagination page={jobsPage} totalPages={jobsTotalPages} from={jobsFrom} to={jobsTo} total={jobsTotal} onPageChange={setJobsPage} />
        )}
      </AdminCard>
    </AdminPage>
  );
}
