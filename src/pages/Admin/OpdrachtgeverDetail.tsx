import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getClientById, updateClient, toggleClientBlocked, listClientJobs } from '../../services/adminClientsService';
import type { AdminClientRow, JobWithMeta } from '../../services/adminClientsService';
import { CLIENT_TYPE_LABELS, CLIENT_TYPE_VALUES } from '../../lib/schemas/adminClientsSchema';
import type { ClientTypeValue } from '../../lib/schemas/adminClientsSchema';
import { demoOpdrachtgevers, demoJobs } from '../../data/adminDemoData';
import { ArrowLeft, Save, Ban, CheckCircle, Briefcase, Info } from 'lucide-react';

const JOBS_PAGE_SIZE = 10;

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
  const [editClientType, setEditClientType] = useState<ClientTypeValue>('direct');

  useEffect(() => {
    if (id) {
      setLoading(true);
      if (id.startsWith('demo-')) {
        const demoRow = demoOpdrachtgevers.find((r) => r.employer.id === id);
        if (demoRow) {
          setRow(demoRow as AdminClientRow);
          setIsDemo(true);
          setEditCompanyName(demoRow.employer.company_name);
          setEditFullName(demoRow.profile.full_name ?? '');
          setEditPhone(demoRow.profile.phone ?? '');
          setEditClientType((demoRow.employer.client_type ?? 'direct') as ClientTypeValue);
        } else {
          setRow(null);
          setIsDemo(false);
        }
        setLoading(false);
      } else {
        getClientById(id).then((r) => {
          setRow(r);
          setIsDemo(false);
          if (r) {
            setEditCompanyName(r.employer.company_name);
            setEditFullName(r.profile.full_name ?? '');
            setEditPhone(r.profile.phone ?? '');
            setEditClientType((r.employer.client_type ?? 'direct') as ClientTypeValue);
          }
          setLoading(false);
        });
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (id.startsWith('demo-')) {
      const demoEmployerJobs = demoJobs.filter((j) => j.employer_id === id);
      setJobsTotal(demoEmployerJobs.length);
      const from = (jobsPage - 1) * JOBS_PAGE_SIZE;
      setJobs(demoEmployerJobs.slice(from, from + JOBS_PAGE_SIZE) as JobWithMeta[]);
    } else {
      listClientJobs(id, { page: jobsPage, pageSize: JOBS_PAGE_SIZE }).then((res) => {
        setJobs(res.data);
        setJobsTotal(res.total);
      });
    }
  }, [id, jobsPage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !row) return;
    if (isDemo) {
      setMessage({ type: 'error', text: 'Demo-data kan niet worden opgeslagen.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const { error } = await updateClient(id, {
      company_name: editCompanyName,
      full_name: editFullName || null,
      phone: editPhone || null,
      client_type: editClientType,
    });
    if (error) {
      setMessage({ type: 'error', text: 'Opslaan mislukt.' });
    } else {
      setMessage({ type: 'success', text: 'Opgeslagen.' });
      const updated = await getClientById(id);
      if (updated) setRow(updated);
    }
    setSaving(false);
  };

  const handleToggleBlock = async () => {
    if (!id || !row) return;
    if (isDemo) return;
    const { error } = await toggleClientBlocked(id);
    if (!error) {
      const updated = await getClientById(id);
      if (updated) setRow(updated);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="p-6">
        <p className="text-red-600">Opdrachtgever niet gevonden.</p>
        <Link to="/admin/opdrachtgevers" className="text-[#4FA151] hover:underline mt-2 inline-block">
          Terug naar opdrachtgevers
        </Link>
      </div>
    );
  }

  const { employer, profile, jobs_count } = row;
  const isBlocked = profile.status === 'BLOCKED';
  const typeLabel = CLIENT_TYPE_LABELS[employer.client_type ?? 'direct'] ?? employer.client_type;
  const jobsFrom = (jobsPage - 1) * JOBS_PAGE_SIZE + 1;
  const jobsTo = Math.min(jobsPage * JOBS_PAGE_SIZE, jobsTotal);
  const jobsTotalPages = Math.max(1, Math.ceil(jobsTotal / JOBS_PAGE_SIZE));

  return (
    <div className="p-6 max-w-4xl">
      <button
        onClick={() => navigate('/admin/opdrachtgevers')}
        className="flex items-center gap-2 text-gray-600 hover:text-[#0F172A] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar opdrachtgevers
      </button>

      <h1 className="text-3xl font-bold text-[#0F172A] mb-2">{employer.company_name || 'Opdrachtgever'}</h1>
      <p className="text-gray-600 mb-6">{profile.email}</p>

      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Dit is een demo-opdrachtgever. Wijzigingen worden niet opgeslagen.</p>
        </div>
      )}

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <span className={message.type === 'success' ? 'text-green-900' : 'text-red-900'}>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">Gegevens</h2>
          <span
            className={`px-2 py-1 text-sm font-medium rounded-full ${
              isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {isBlocked ? 'Geblokkeerd' : 'Actief'}
          </span>
        </div>
        <div className="p-6">
          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contactpersoon</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input type="email" value={profile.email} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type opdrachtgever</label>
                <select
                  value={editClientType}
                  onChange={(e) => setEditClientType(e.target.value as ClientTypeValue)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                >
                  {CLIENT_TYPE_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {CLIENT_TYPE_LABELS[v]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#3E8E45] transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Opslaan...' : 'Opslaan'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/opdrachtgevers/${id}`, { replace: true })}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>Bedrijfsnaam:</strong> {employer.company_name || '—'}</p>
              <p><strong>Contactpersoon:</strong> {profile.full_name || '—'}</p>
              <p><strong>E-mail:</strong> {profile.email}</p>
              <p><strong>Telefoon:</strong> {profile.phone || '—'}</p>
              <p><strong>Type:</strong> {typeLabel}</p>
              <p><strong>Registratiedatum:</strong> {new Date(profile.created_at).toLocaleDateString('nl-NL')}</p>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleToggleBlock}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                    isBlocked
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                  {isBlocked ? 'Deblokkeren' : 'Blokkeren'}
                </button>
                <Link
                  to={`/admin/opdrachtgevers/${id}?edit=1`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Bewerken
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#4FA151]" />
          <h2 className="text-lg font-semibold text-[#0F172A]">Opdrachten ({jobs_count})</h2>
        </div>
        <div className="p-6">
          {jobs.length === 0 ? (
            <p className="text-gray-500">Geen opdrachten.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {jobs.map((job) => (
                  <li key={job.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <Link to={`/admin/opdrachten`} className="font-medium text-[#0F172A] hover:underline">
                        {job.title}
                      </Link>
                      <span className="ml-2 text-xs text-gray-500">
                        {job.status} · {new Date(job.created_at).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                    <Link to={`/opdrachten/${job.id}`} className="text-sm text-[#4FA151] hover:underline">
                      Bekijk
                    </Link>
                  </li>
                ))}
              </ul>
              {jobsTotal > JOBS_PAGE_SIZE && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {jobsFrom}–{jobsTo} van {jobsTotal}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setJobsPage((p) => Math.max(1, p - 1))}
                      disabled={jobsPage <= 1}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Vorige
                    </button>
                    <button
                      type="button"
                      onClick={() => setJobsPage((p) => Math.min(jobsTotalPages, p + 1))}
                      disabled={jobsPage >= jobsTotalPages}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Volgende
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
