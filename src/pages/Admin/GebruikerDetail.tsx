import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Profile, Doctor, Employer, UserRole } from '../../lib/types';
import { demoProfiles, demoDoctors, demoEmployers } from '../../data/adminDemoData';
import { Save, ArrowLeft, AlertCircle, User, Briefcase, Stethoscope, Info, Trash2 } from 'lucide-react';
import { deleteUserPermanently } from '../../services/adminUsersService';

const ROLE_OPTIONS: UserRole[] = ['ARTS', 'OPDRACHTGEVER', 'ADMIN'];
const STATUS_OPTIONS = ['ACTIVE', 'BLOCKED'];

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

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    setDoctor(null);
    setEmployer(null);

    const [profileRes, doctorRes, employerRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
      supabase.from('doctors').select('*').eq('user_id', id).maybeSingle(),
      supabase.from('employers').select('*').eq('user_id', id).maybeSingle(),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setIsDemo(false);
      if (doctorRes.data) setDoctor(doctorRes.data);
      if (employerRes.data) setEmployer(employerRes.data);
    } else {
      const demoProfile = demoProfiles.find((p) => p.id === id);
      if (demoProfile) {
        setProfile(demoProfile);
        setIsDemo(true);
        const demoDoctor = demoDoctors.find((d) => d.user_id === id);
        setDoctor(demoDoctor ? (demoDoctor as Doctor) : null);
        const demoEmployer = demoEmployers.find((e) => e.user_id === id);
        setEmployer(demoEmployer ?? null);
      } else {
        setProfile(null);
        setDoctor(null);
        setEmployer(null);
      }
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !profile || isDemo) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: profile.role,
          status: profile.status,
          full_name: profile.full_name ?? null,
          phone: profile.phone ?? null,
        })
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Gebruiker opgeslagen.' });
      fetchData();
    } catch {
      setMessage({ type: 'error', text: 'Opslaan mislukt.' });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!id || isDemo) return;
    const msg = 'Weet u het zeker? De gebruiker wordt definitief verwijderd uit de database, inclusief profiel, opdrachten, sollicitaties en aanmelding. Dit kan niet ongedaan worden gemaakt.';
    if (!window.confirm(msg)) return;
    setDeleting(true);
    setMessage(null);
    const { error } = await deleteUserPermanently(id);
    if (error) {
      setMessage({ type: 'error', text: error });
      setDeleting(false);
      return;
    }
    navigate('/admin/gebruikers', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] rounded-xl bg-white/60 border border-emerald-100">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-red-600">Gebruiker niet gevonden.</p>
        <Link to="/admin/gebruikers" className="text-[#4FA151] hover:underline mt-2 inline-block">
          Terug naar gebruikers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate('/admin/gebruikers')} className="flex items-center gap-2 text-emerald-700/80 hover:text-[#4FA151] mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Terug naar gebruikers
      </button>

      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-gebruiker. Opslaan is uitgeschakeld.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Gebruiker bewerken</h1>
      <p className="text-emerald-700/80 text-sm mb-6">{profile.email}</p>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`} />
          <span className={message.type === 'success' ? 'text-emerald-900' : 'text-red-900'}>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/80">
            <h2 className="text-lg font-semibold text-emerald-900/90 flex items-center gap-2">
              <User className="w-5 h-5 text-[#4FA151]" />
              Profiel
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-800/80 mb-2">Naam</label>
              <input type="text" value={profile.full_name ?? ''} onChange={(e) => setProfile((p) => (p ? { ...p, full_name: e.target.value || null } : null))} className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-800/80 mb-2">E-mail</label>
              <input type="email" value={profile.email ?? ''} disabled className="w-full px-4 py-2.5 border border-emerald-100 rounded-xl bg-emerald-50/50 text-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-800/80 mb-2">Telefoon</label>
              <input type="tel" value={profile.phone ?? ''} onChange={(e) => setProfile((p) => (p ? { ...p, phone: e.target.value || null } : null))} className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-800/80 mb-2">Rol</label>
              <select value={profile.role ?? ''} onChange={(e) => setProfile((p) => (p ? { ...p, role: e.target.value as UserRole } : null))} className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-800/80 mb-2">Status</label>
              <select value={profile.status ?? 'ACTIVE'} onChange={(e) => setProfile((p) => (p ? { ...p, status: e.target.value } : null))} className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'ACTIVE' ? 'Actief' : 'Geblokkeerd'}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-500">Aangemaakt: {new Date(profile.created_at!).toLocaleString('nl-NL')}</p>
          </div>
        </div>

        {doctor && (
          <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/80">
              <h2 className="text-lg font-semibold text-emerald-900/90 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#4FA151]" />
                Arts-profiel
              </h2>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <p><strong>BIG-nummer:</strong> {doctor.big_number}</p>
              <p><strong>Verificatie:</strong> {doctor.verification_status}</p>
              <p><strong>Plan:</strong> {(doctor as { doctor_plan?: string }).doctor_plan === 'PRO' ? 'PRO' : 'BASIC'}</p>
              <Link to="/admin/verificaties" className="text-[#4FA151] hover:underline">Naar verificaties →</Link>
            </div>
          </div>
        )}

        {employer && (
          <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/80">
              <h2 className="text-lg font-semibold text-emerald-900/90 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#4FA151]" />
                Bedrijf
              </h2>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <p><strong>Bedrijfsnaam:</strong> {employer.company_name}</p>
              {employer.kvk && <p><strong>KVK:</strong> {employer.kvk}</p>}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving || isDemo} className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#3E8E45] transition disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
          <button type="button" onClick={() => navigate('/admin/gebruikers')} className="px-6 py-2.5 border border-emerald-200 rounded-xl font-medium text-emerald-800 hover:bg-emerald-50 transition">
            Annuleren
          </button>
          {!isDemo && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 ml-auto px-6 py-2.5 bg-red-100 text-red-800 rounded-xl font-medium hover:bg-red-200 transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Verwijderen...' : 'Gebruiker definitief verwijderen'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
