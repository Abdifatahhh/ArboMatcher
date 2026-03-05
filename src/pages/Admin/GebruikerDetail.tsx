import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Profile, Doctor, Employer, UserRole } from '../../lib/types';
import { demoProfiles, demoDoctors, demoEmployers } from '../../data/adminDemoData';
import { Save, ArrowLeft, AlertCircle, User, Briefcase, Stethoscope, Info } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
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
      <button
        onClick={() => navigate('/admin/gebruikers')}
        className="flex items-center gap-2 text-gray-600 hover:text-[#0F172A] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar gebruikers
      </button>

      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-gebruiker. Opslaan is uitgeschakeld.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Gebruiker bewerken</h1>
      <p className="text-gray-600 mb-6">{profile.email}</p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <AlertCircle className={`w-5 h-5 flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
          <span className={message.type === 'success' ? 'text-green-900' : 'text-red-900'}>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
              <User className="w-5 h-5 text-[#4FA151]" />
              Profiel
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
              <input
                type="text"
                value={profile.full_name ?? ''}
                onChange={(e) => setProfile((p) => (p ? { ...p, full_name: e.target.value || null } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input type="email" value={profile.email ?? ''} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
              <input
                type="tel"
                value={profile.phone ?? ''}
                onChange={(e) => setProfile((p) => (p ? { ...p, phone: e.target.value || null } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={profile.role ?? ''}
                onChange={(e) => setProfile((p) => (p ? { ...p, role: e.target.value as UserRole } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={profile.status ?? 'ACTIVE'}
                onChange={(e) => setProfile((p) => (p ? { ...p, status: e.target.value } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === 'ACTIVE' ? 'Actief' : 'Geblokkeerd'}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500">Aangemaakt: {new Date(profile.created_at!).toLocaleString('nl-NL')}</p>
          </div>
        </div>

        {doctor && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#4FA151]" />
                Arts-profiel
              </h2>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <p><strong>BIG-nummer:</strong> {doctor.big_number}</p>
              <p><strong>Verificatie:</strong> {doctor.verification_status}</p>
              <p><strong>Premium:</strong> {doctor.premium_status ? 'Ja' : 'Nee'}</p>
              <Link to="/admin/verificaties" className="text-[#4FA151] hover:underline">Naar verificaties →</Link>
            </div>
          </div>
        )}

        {employer && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || isDemo}
            className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#3E8E45] transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/gebruikers')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}
