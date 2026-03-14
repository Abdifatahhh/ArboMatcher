import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Doctor, Profile } from '../../lib/types';
import { getDoctorById, toggleDoctorBlocked, listDoctorApplications } from '../../services/adminDoctorsService';
import type { ApplicationWithJob } from '../../services/adminDoctorsService';
import { checkBigNumber } from '../../services/bigCheckService';
import type { BigCheckResult } from '../../services/bigCheckService';
import { demoDoctorsList, demoApplications } from '../../data/adminDemoData';
import { Save, User, Stethoscope, Shield, Ban, CheckCircle, FileText, Search, Loader2 } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminCard, AdminAlert, AdminBadge, AdminLoadingState, AdminPagination } from '../../components/Admin/adminUI';
import { AdminBreadcrumbs } from '../../components/Admin/AdminBreadcrumbs';

const VERIFICATION_STATUSES: Array<Doctor['verification_status']> = ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'];
const APPLICATIONS_PAGE_SIZE = 10;

const fi = 'w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition';
const fd = 'w-full h-10 px-3 border border-slate-100 rounded-lg text-sm text-slate-500 bg-slate-50';
const fl = 'block text-sm font-medium text-slate-700 mb-1.5';
const ft = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-y';

export default function AdminArtsDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editMode = searchParams.get('edit') === '1';
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [doctor, setDoctor] = useState<Partial<Doctor> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [applicationsTotal, setApplicationsTotal] = useState(0);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [bigCheckResult, setBigCheckResult] = useState<BigCheckResult | null>(null);
  const [bigCheckLoading, setBigCheckLoading] = useState(false);

  const loadDoctor = async () => {
    if (!id) return;
    setLoading(true);
    if (id.startsWith('demo-')) {
      const demoRow = demoDoctorsList.find((r) => r.doctor.id === id);
      if (demoRow) { setDoctor(demoRow.doctor); setProfile(demoRow.profile); setIsDemo(true); } else { setDoctor(null); setProfile(null); setIsDemo(false); }
      setLoading(false); return;
    }
    const row = await getDoctorById(id);
    if (row) { setDoctor(row.doctor); setProfile(row.profile); setIsDemo(false); } else { setDoctor(null); setProfile(null); }
    setLoading(false);
  };

  useEffect(() => { if (id) loadDoctor(); }, [id]);

  useEffect(() => {
    if (!id) return;
    if (id.startsWith('demo-')) {
      const demoApps = demoApplications.filter((a) => a.professional_id === id);
      setApplicationsTotal(demoApps.length);
      const from = (applicationsPage - 1) * APPLICATIONS_PAGE_SIZE;
      setApplications(demoApps.slice(from, from + APPLICATIONS_PAGE_SIZE).map((a) => ({ id: a.id, status: a.status, created_at: a.created_at, jobs: a.jobs ? { id: a.jobs.id, title: a.jobs.title } : null })));
    } else {
      listDoctorApplications(id, { page: applicationsPage, pageSize: APPLICATIONS_PAGE_SIZE }).then((res) => { setApplications(res.data); setApplicationsTotal(res.total); });
    }
  }, [id, applicationsPage]);

  const handleToggleBlock = async () => {
    if (!id || !profile || isDemo) return;
    const { error } = await toggleDoctorBlocked(id);
    if (!error) { const row = await getDoctorById(id); if (row) setProfile(row.profile); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !doctor || !profile) return;
    if (isDemo) { setMessage({ type: 'error', text: 'Demo-data kan niet worden opgeslagen.' }); return; }
    const bigDigits = (doctor.big_number ?? '').replace(/\D/g, '');
    if (bigDigits.length > 0 && bigDigits.length !== 11) { setMessage({ type: 'error', text: 'BIG-nummer moet 11 cijfers bevatten.' }); return; }
    setSaving(true); setMessage(null);
    try {
      if (profile.id) await supabase.from('profiles').update({ full_name: profile.full_name ?? null, phone: profile.phone ?? null }).eq('id', profile.id);
      const specialties = typeof doctor.specialties === 'string' ? (doctor.specialties as string).split(',').map((s) => s.trim()).filter(Boolean) : Array.isArray(doctor.specialties) ? doctor.specialties : [];
      const regions = typeof doctor.regions === 'string' ? (doctor.regions as string).split(',').map((s) => s.trim()).filter(Boolean) : Array.isArray(doctor.regions) ? doctor.regions : [];
      await supabase.from('professionals').update({
        big_number: doctor.big_number ?? '', bio: doctor.bio ?? null, specialties, regions,
        hourly_rate: doctor.hourly_rate != null && doctor.hourly_rate !== '' ? Number(doctor.hourly_rate) : null,
        availability_text: doctor.availability_text ?? null, verification_status: doctor.verification_status ?? 'UNVERIFIED',
        verification_reason: doctor.verification_reason ?? null,
        plan: (doctor as any).plan === 'PRO' ? 'PRO' : 'GRATIS',
      }).eq('id', id);
      setMessage({ type: 'success', text: 'Professional-profiel opgeslagen.' }); await loadDoctor();
    } catch { setMessage({ type: 'error', text: 'Opslaan mislukt.' }); }
    setSaving(false);
  };

  if (loading) return <AdminPage><AdminLoadingState rows={8} /></AdminPage>;

  if (!doctor) {
    return (
      <AdminPage>
        <AdminAlert variant="error">Professional niet gevonden.</AdminAlert>
        <Link to="/admin/professionals" className="text-sm text-blue-600 hover:underline mt-2 inline-block">Terug naar professionals</Link>
      </AdminPage>
    );
  }

  const specialtiesStr = Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : (doctor.specialties as string) ?? '';
  const regionsStr = Array.isArray(doctor.regions) ? doctor.regions.join(', ') : (doctor.regions as string) ?? '';
  const isBlocked = profile?.status === 'BLOCKED';
  const appFrom = applicationsTotal === 0 ? 0 : (applicationsPage - 1) * APPLICATIONS_PAGE_SIZE + 1;
  const appTo = Math.min(applicationsPage * APPLICATIONS_PAGE_SIZE, applicationsTotal);
  const appTotalPages = Math.max(1, Math.ceil(applicationsTotal / APPLICATIONS_PAGE_SIZE));

  return (
    <AdminPage className="max-w-4xl">
      <AdminBreadcrumbs items={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Professionals', to: '/admin/professionals' },
        { label: profile?.full_name || 'Detail' },
      ]} />

      <AdminPageHeader
        icon={Stethoscope}
        title={profile?.full_name || 'Professional'}
        description={(profile as Profile)?.email}
        actions={
          <div className="flex items-center gap-2">
            <AdminBadge variant={isBlocked ? 'danger' : 'success'} dot>{isBlocked ? 'Geblokkeerd' : 'Actief'}</AdminBadge>
            {!isDemo && (
              <button type="button" onClick={handleToggleBlock} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${isBlocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                {isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                {isBlocked ? 'Deblokkeren' : 'Blokkeren'}
              </button>
            )}
            {!editMode && <Link to={`/admin/professionals/${id}?edit=1`} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Bewerken</Link>}
            {editMode && <button type="button" onClick={() => navigate(`/admin/professionals/${id}`)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">Annuleren</button>}
          </div>
        }
      />

      {isDemo && <AdminAlert variant="warning">Dit is een demo-professional. Wijzigingen worden niet opgeslagen.</AdminAlert>}
      {message && <AdminAlert variant={message.type === 'success' ? 'success' : 'error'} onClose={() => setMessage(null)}>{message.text}</AdminAlert>}

      {!editMode && doctor && profile && (
        <AdminCard title="Gegevens" actions={<User className="w-4 h-4 text-slate-400" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><span className="text-slate-500">Naam:</span> <span className="font-medium text-slate-900">{profile.full_name || '—'}</span></div>
            <div><span className="text-slate-500">E-mail:</span> <span className="font-medium text-slate-900">{(profile as Profile).email}</span></div>
            <div><span className="text-slate-500">Telefoon:</span> <span className="text-slate-700">{profile.phone || '—'}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">BIG:</span> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{doctor.big_number}</code>
              <button type="button" onClick={async () => {
                const digits = (doctor.big_number ?? '').replace(/\D/g, '');
                if (digits.length !== 11) { setBigCheckResult({ formatValid: false, registerChecked: false, found: false, message: 'BIG-nummer bestaat uit 11 cijfers.' }); return; }
                setBigCheckLoading(true); setBigCheckResult(null);
                const res = await checkBigNumber(doctor.big_number ?? '');
                setBigCheckResult(res); setBigCheckLoading(false);
              }} disabled={bigCheckLoading || !doctor.big_number} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition">
                {bigCheckLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />} BIG check
              </button>
            </div>
            <div><span className="text-slate-500">Verificatie:</span> <AdminBadge variant={doctor.verification_status === 'VERIFIED' ? 'success' : doctor.verification_status === 'PENDING' ? 'warning' : doctor.verification_status === 'REJECTED' ? 'danger' : 'neutral'}>{doctor.verification_status ?? ''}</AdminBadge></div>
            <div><span className="text-slate-500">Plan:</span> <AdminBadge variant={(doctor as any).plan === 'PRO' ? 'info' : 'neutral'}>{(doctor as any).plan === 'PRO' ? 'PRO' : 'Gratis'}</AdminBadge></div>
            {doctor.bio && <div className="sm:col-span-2"><span className="text-slate-500">Bio:</span> <span className="text-slate-700">{doctor.bio}</span></div>}
          </div>
          {bigCheckResult && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${bigCheckResult.found ? 'bg-emerald-50 text-emerald-800' : bigCheckResult.formatValid ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'}`}>
              {bigCheckResult.message}
              {bigCheckResult.name && <span className="block mt-1 text-slate-600">Naam in register: {bigCheckResult.name}</span>}
              {bigCheckResult.error && <span className="block mt-1 text-xs text-slate-500">{bigCheckResult.error}</span>}
            </div>
          )}
        </AdminCard>
      )}

      {editMode && (
        <form onSubmit={handleSave} className="space-y-5">
          <AdminCard title="Persoonlijke gegevens" actions={<User className="w-4 h-4 text-slate-400" />}>
            <div className="space-y-4">
              <div><label className={fl}>Volledige naam</label><input type="text" value={profile?.full_name ?? ''} onChange={(e) => setProfile((p) => p ? { ...p, full_name: e.target.value || null } : null)} className={fi} /></div>
              <div><label className={fl}>Telefoonnummer</label><input type="tel" value={profile?.phone ?? ''} onChange={(e) => setProfile((p) => p ? { ...p, phone: e.target.value || null } : null)} className={fi} /></div>
              <div><label className={fl}>E-mailadres</label><input type="email" value={(profile as Profile)?.email ?? ''} disabled className={fd} /></div>
            </div>
          </AdminCard>

          <AdminCard title="Professionele gegevens" actions={<Stethoscope className="w-4 h-4 text-slate-400" />}>
            <div className="space-y-4">
              <div><label className={fl}>BIG-nummer</label><input type="text" inputMode="numeric" maxLength={11} value={doctor.big_number ?? ''} onChange={(e) => setDoctor((d) => d ? { ...d, big_number: e.target.value.replace(/\D/g, '').slice(0, 11) } : null)} className={fi} placeholder="12345678901" /></div>
              <div><label className={fl}>Bio</label><textarea value={doctor.bio ?? ''} onChange={(e) => setDoctor((d) => d ? { ...d, bio: e.target.value || null } : null)} rows={4} className={ft} /></div>
              <div><label className={fl}>Specialisaties (kommagescheiden)</label><input type="text" value={specialtiesStr} onChange={(e) => setDoctor((d) => d ? { ...d, specialties: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } : null)} className={fi} /></div>
              <div><label className={fl}>Regio's (kommagescheiden)</label><input type="text" value={regionsStr} onChange={(e) => setDoctor((d) => d ? { ...d, regions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } : null)} className={fi} /></div>
              <div><label className={fl}>Uurtarief (€)</label><input type="number" min={0} step={5} value={doctor.hourly_rate ?? ''} onChange={(e) => setDoctor((d) => d ? { ...d, hourly_rate: e.target.value === '' ? null : parseFloat(e.target.value) } : null)} className={fi} /></div>
              <div><label className={fl}>Beschikbaarheid</label><textarea value={doctor.availability_text ?? ''} onChange={(e) => setDoctor((d) => d ? { ...d, availability_text: e.target.value || null } : null)} rows={3} className={ft} /></div>
            </div>
          </AdminCard>

          <AdminCard title="Admin: verificatie & plan" actions={<Shield className="w-4 h-4 text-slate-400" />}>
            <div className="space-y-4">
              <div><label className={fl}>Verificatiestatus</label><select value={doctor.verification_status ?? 'UNVERIFIED'} onChange={(e) => setDoctor((d) => d ? { ...d, verification_status: e.target.value as Doctor['verification_status'] } : null)} className={fi}>{VERIFICATION_STATUSES.map((s) => <option key={s} value={s}>{s === 'VERIFIED' ? 'Geverifieerd' : s === 'PENDING' ? 'In behandeling' : s === 'REJECTED' ? 'Afgewezen' : 'Niet geverifieerd'}</option>)}</select></div>
              <div><label className={fl}>Reden (bij afwijzing)</label><input type="text" value={doctor.verification_reason ?? ''} onChange={(e) => setDoctor((d) => d ? { ...d, verification_reason: e.target.value || null } : null)} className={fi} placeholder="Optioneel" /></div>
              <div><label className={fl}>Plan</label><select value={(doctor as any).plan ?? 'GRATIS'} onChange={(e) => setDoctor((d) => d ? { ...d, plan: e.target.value as 'GRATIS' | 'PRO' } : null)} className={fi}><option value="GRATIS">Gratis</option><option value="PRO">PRO</option></select></div>
            </div>
          </AdminCard>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-medium hover:from-emerald-600 hover:to-green-500 disabled:opacity-50 transition shadow-lg shadow-emerald-500/20"><Save className="w-4 h-4" /> {saving ? 'Opslaan...' : 'Opslaan'}</button>
            <button type="button" onClick={() => navigate('/admin/professionals')} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">Annuleren</button>
          </div>
        </form>
      )}

      <AdminCard title={`Sollicitaties (${applicationsTotal})`} actions={<FileText className="w-4 h-4 text-slate-400" />}>
        {applications.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">Geen sollicitaties.</p>
        ) : (
          <div className="divide-y divide-slate-50 -mx-5">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-2.5">
                <div>
                  <Link to="/admin/reacties" className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">{app.jobs?.title || 'Opdracht'}</Link>
                  <span className="ml-2 text-xs text-slate-400">{app.status} · {new Date(app.created_at).toLocaleDateString('nl-NL')}</span>
                </div>
                <Link to={`/opdrachten/${app.jobs?.id}`} className="text-xs text-blue-600 hover:underline">Bekijk</Link>
              </div>
            ))}
          </div>
        )}
        {applicationsTotal > APPLICATIONS_PAGE_SIZE && (
          <AdminPagination page={applicationsPage} totalPages={appTotalPages} from={appFrom} to={appTo} total={applicationsTotal} onPageChange={setApplicationsPage} />
        )}
      </AdminCard>
    </AdminPage>
  );
}
