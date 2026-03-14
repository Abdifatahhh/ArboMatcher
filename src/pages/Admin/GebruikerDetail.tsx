import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Profile, Doctor, Employer, UserRole } from '../../lib/types';
import { demoProfiles, demoDoctors, demoEmployers } from '../../data/adminDemoData';
import { Save, User, Briefcase, Stethoscope, Trash2, CheckCircle } from 'lucide-react';
import { deleteUserPermanently } from '../../services/adminUsersService';
import { AdminPage, AdminPageHeader, AdminCard, AdminAlert, AdminLoadingState } from '../../components/Admin/adminUI';
import { AdminBreadcrumbs } from '../../components/Admin/AdminBreadcrumbs';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'ORGANISATIE', label: 'Organisatie' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'onboarding', label: 'Onboarding' },
];
const STATUS_OPTIONS = ['ACTIVE', 'BLOCKED'];

const fi = 'w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition';
const fd = 'w-full h-10 px-3 border border-slate-100 rounded-lg text-sm text-slate-500 bg-slate-50';
const fl = 'block text-sm font-medium text-slate-700 mb-1.5';

export default function AdminGebruikerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => { if (id) fetchData(); }, [id]);

  const fetchData = async () => {
    if (!id) return;
    setDoctor(null); setEmployer(null);
    const [profileRes, doctorRes, employerRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
      supabase.from('professionals').select('*').eq('user_id', id).maybeSingle(),
      supabase.from('employers').select('*').eq('user_id', id).maybeSingle(),
    ]);
    if (profileRes.data) { setProfile(profileRes.data); setIsDemo(false); if (doctorRes.data) setDoctor(doctorRes.data); if (employerRes.data) setEmployer(employerRes.data); }
    else {
      const dp = demoProfiles.find((p) => p.id === id);
      if (dp) { setProfile(dp); setIsDemo(true); setDoctor(demoDoctors.find((d) => d.user_id === id) as Doctor ?? null); setEmployer(demoEmployers.find((e) => e.user_id === id) ?? null); }
      else { setProfile(null); }
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !profile || isDemo) return;
    setSaving(true); setMessage(null);
    try {
      const { error } = await supabase.from('profiles').update({ role: profile.role, status: profile.status, full_name: profile.full_name ?? null, phone: profile.phone ?? null }).eq('id', id);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Gebruiker opgeslagen.' }); fetchData();
    } catch { setMessage({ type: 'error', text: 'Opslaan mislukt.' }); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!id || isDemo) return;
    if (!window.confirm('Weet u het zeker? De gebruiker wordt definitief verwijderd. Dit kan niet ongedaan worden gemaakt.')) return;
    setDeleting(true); setMessage(null);
    const { error } = await deleteUserPermanently(id);
    if (error) { setMessage({ type: 'error', text: error }); setDeleting(false); return; }
    setDeleting(false); setDeleteSuccess(true);
    setTimeout(() => navigate('/admin/gebruikers', { replace: true }), 2500);
  };

  if (loading) return <AdminPage><AdminLoadingState rows={6} /></AdminPage>;

  if (deleteSuccess) {
    return (
      <AdminPage>
        <div className="flex items-center justify-center min-h-[50vh]">
          <AdminCard className="max-w-md w-full text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Account verwijderd</h2>
            <p className="text-sm text-slate-500">U wordt doorgestuurd naar de gebruikerslijst.</p>
          </AdminCard>
        </div>
      </AdminPage>
    );
  }

  if (!profile) {
    return (
      <AdminPage>
        <AdminAlert variant="error">Gebruiker niet gevonden.</AdminAlert>
        <Link to="/admin/gebruikers" className="text-sm text-emerald-600 hover:underline mt-2 inline-block">Terug naar gebruikers</Link>
      </AdminPage>
    );
  }

  return (
    <AdminPage className="max-w-3xl">
      <AdminBreadcrumbs items={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Gebruikers', to: '/admin/gebruikers' },
        { label: profile.full_name || profile.email || 'Detail' },
      ]} />

      <AdminPageHeader icon={User} title="Gebruiker bewerken" description={profile.email ?? ''} />

      {isDemo && <AdminAlert variant="warning">Demo-gebruiker. Opslaan is uitgeschakeld.</AdminAlert>}
      {message && <AdminAlert variant={message.type === 'success' ? 'success' : 'error'} onClose={() => setMessage(null)}>{message.text}</AdminAlert>}

      <form onSubmit={handleSave} className="space-y-5">
        <AdminCard title="Profiel">
          <div className="space-y-4">
            <div><label className={fl}>Naam</label><input type="text" value={profile.full_name ?? ''} onChange={(e) => setProfile((p) => p ? { ...p, full_name: e.target.value || null } : null)} className={fi} /></div>
            <div><label className={fl}>E-mail</label><input type="email" value={profile.email ?? ''} disabled className={fd} /></div>
            <div><label className={fl}>Telefoon</label><input type="tel" value={profile.phone ?? ''} onChange={(e) => setProfile((p) => p ? { ...p, phone: e.target.value || null } : null)} className={fi} /></div>
            <div><label className={fl}>Rol</label><select value={profile.role ?? ''} onChange={(e) => setProfile((p) => p ? { ...p, role: e.target.value as UserRole } : null)} className={fi}>{ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
            <div><label className={fl}>Status</label><select value={profile.status ?? 'ACTIVE'} onChange={(e) => setProfile((p) => p ? { ...p, status: e.target.value } : null)} className={fi}>{STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'ACTIVE' ? 'Actief' : 'Geblokkeerd'}</option>)}</select></div>
            <p className="text-xs text-slate-400">Aangemaakt: {new Date(profile.created_at!).toLocaleString('nl-NL')}</p>
          </div>
        </AdminCard>

        {doctor && (
          <AdminCard title="Professional-profiel" actions={<Stethoscope className="w-4 h-4 text-slate-400" />}>
            <div className="space-y-1.5 text-sm text-slate-700">
              <p><span className="text-slate-500">BIG:</span> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{doctor.big_number}</code></p>
              <p><span className="text-slate-500">Verificatie:</span> {doctor.verification_status}</p>
              <p><span className="text-slate-500">Plan:</span> {(doctor as any).plan === 'PRO' ? 'PRO' : 'Gratis'}</p>
              <Link to="/admin/verificaties" className="text-emerald-600 hover:underline text-sm">Naar verificaties →</Link>
            </div>
          </AdminCard>
        )}

        {employer && (
          <AdminCard title="Bedrijfsgegevens" actions={<Briefcase className="w-4 h-4 text-slate-400" />}>
            <div className="space-y-1.5 text-sm text-slate-700">
              <p><span className="text-slate-500">Bedrijfsnaam:</span> {employer.company_name}</p>
              {employer.kvk && <p><span className="text-slate-500">KVK:</span> {employer.kvk}</p>}
            </div>
          </AdminCard>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saving || isDemo} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-medium hover:from-emerald-600 hover:to-green-500 disabled:opacity-50 transition shadow-lg shadow-emerald-500/20">
            <Save className="w-4 h-4" /> {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
          <button type="button" onClick={() => navigate('/admin/gebruikers')} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">Annuleren</button>
          {!isDemo && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 ml-auto px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition">
              <Trash2 className="w-4 h-4" /> {deleting ? 'Verwijderen...' : 'Definitief verwijderen'}
            </button>
          )}
        </div>
      </form>
    </AdminPage>
  );
}
