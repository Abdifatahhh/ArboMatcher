import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Doctor, Profile } from '../../lib/types';
import { getDoctorById, toggleDoctorBlocked, listDoctorApplications } from '../../services/adminDoctorsService';
import type { ApplicationWithJob } from '../../services/adminDoctorsService';
import { checkBigNumber } from '../../services/bigCheckService';
import type { BigCheckResult } from '../../services/bigCheckService';
import { demoDoctorsList, demoApplications } from '../../data/adminDemoData';
import { Save, ArrowLeft, AlertCircle, User, Stethoscope, Shield, Crown, Ban, CheckCircle, FileText, Info, Search, Loader2 } from 'lucide-react';

const VERIFICATION_STATUSES: Array<Doctor['verification_status']> = ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'];
const APPLICATIONS_PAGE_SIZE = 10;

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

  useEffect(() => {
    if (id) {
      setLoading(true);
      if (id.startsWith('demo-')) {
        const demoRow = demoDoctorsList.find((r) => r.doctor.id === id);
        if (demoRow) {
          setDoctor(demoRow.doctor);
          setProfile(demoRow.profile);
          setIsDemo(true);
        } else {
          setDoctor(null);
          setProfile(null);
          setIsDemo(false);
        }
        setLoading(false);
      } else {
        getDoctorById(id).then((row) => {
          if (row) {
            setDoctor(row.doctor);
            setProfile(row.profile);
            setIsDemo(false);
          } else {
            setDoctor(null);
            setProfile(null);
          }
          setLoading(false);
        });
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (id.startsWith('demo-')) {
      const demoApps = demoApplications.filter((a) => a.doctor_id === id);
      setApplicationsTotal(demoApps.length);
      const from = (applicationsPage - 1) * APPLICATIONS_PAGE_SIZE;
      setApplications(
        demoApps.slice(from, from + APPLICATIONS_PAGE_SIZE).map((a) => ({
          id: a.id,
          status: a.status,
          created_at: a.created_at,
          jobs: a.jobs ? { id: a.jobs.id, title: a.jobs.title } : null,
        }))
      );
    } else {
      listDoctorApplications(id, { page: applicationsPage, pageSize: APPLICATIONS_PAGE_SIZE }).then((res) => {
        setApplications(res.data);
        setApplicationsTotal(res.total);
      });
    }
  }, [id, applicationsPage]);

  const handleToggleBlock = async () => {
    if (!id || !profile || isDemo) return;
    const { error } = await toggleDoctorBlocked(id);
    if (!error) {
      const row = await getDoctorById(id);
      if (row) {
        setProfile(row.profile);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !doctor || !profile) return;
    if (isDemo) {
      setMessage({ type: 'error', text: 'Demo-data kan niet worden opgeslagen.' });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      if (profile.id) {
        await supabase
          .from('profiles')
          .update({
            full_name: profile.full_name ?? null,
            phone: profile.phone ?? null,
          })
          .eq('id', profile.id);
      }

      const specialties = typeof doctor.specialties === 'string'
        ? (doctor.specialties as string).split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(doctor.specialties)
        ? doctor.specialties
        : [];
      const regions = typeof doctor.regions === 'string'
        ? (doctor.regions as string).split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(doctor.regions)
        ? doctor.regions
        : [];

      await supabase
        .from('doctors')
        .update({
          big_number: doctor.big_number ?? '',
          bio: doctor.bio ?? null,
          specialties,
          regions,
          hourly_rate: doctor.hourly_rate != null && doctor.hourly_rate !== '' ? Number(doctor.hourly_rate) : null,
          availability_text: doctor.availability_text ?? null,
          verification_status: doctor.verification_status ?? 'UNVERIFIED',
          verification_reason: doctor.verification_reason ?? null,
          premium_status: Boolean(doctor.premium_status),
          premium_until: doctor.premium_until || null,
        })
        .eq('id', id);

      setMessage({ type: 'success', text: 'Arts-profiel opgeslagen.' });
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

  if (!doctor) {
    return (
      <div className="p-6">
        <p className="text-red-600">Arts niet gevonden.</p>
        <Link to="/admin/artsen" className="text-[#4FA151] hover:underline mt-2 inline-block">
          Terug naar artsen
        </Link>
      </div>
    );
  }

  const specialtiesStr = Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : (doctor.specialties as string) ?? '';
  const regionsStr = Array.isArray(doctor.regions) ? doctor.regions.join(', ') : (doctor.regions as string) ?? '';

  return (
    <div className="p-6 max-w-4xl">
      <button
        onClick={() => navigate('/admin/artsen')}
        className="flex items-center gap-2 text-gray-600 hover:text-[#0F172A] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar artsen
      </button>

      <h1 className="text-3xl font-bold text-[#0F172A] mb-2">{profile?.full_name || 'Arts bewerken'}</h1>
      <p className="text-gray-600 mb-6">
        {(profile as Profile)?.email}
      </p>

      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Dit is een demo-arts. Wijzigingen worden niet opgeslagen.</p>
        </div>
      )}

      {profile && (
        <div className="mb-6 flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.status === 'BLOCKED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {profile.status === 'BLOCKED' ? 'Geblokkeerd' : 'Actief'}
          </span>
          {!isDemo && (
            <button
              type="button"
              onClick={handleToggleBlock}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${profile.status === 'BLOCKED' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
            >
              {profile.status === 'BLOCKED' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
              {profile.status === 'BLOCKED' ? 'Deblokkeren' : 'Blokkeren'}
            </button>
          )}
          {!editMode && (
            <Link to={`/admin/artsen/${id}?edit=1`} className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
              Bewerken
            </Link>
          )}
          {editMode && (
            <button type="button" onClick={() => navigate(`/admin/artsen/${id}`)} className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
              Annuleren
            </button>
          )}
        </div>
      )}

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

      {!editMode && doctor && profile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
              <User className="w-5 h-5 text-[#4FA151]" />
              Gegevens
            </h2>
          </div>
          <div className="p-6 space-y-2 text-sm">
            <p><strong>Naam:</strong> {profile.full_name || '—'}</p>
            <p><strong>E-mail:</strong> {(profile as Profile).email}</p>
            <p><strong>Telefoon:</strong> {profile.phone || '—'}</p>
            <p className="flex items-center gap-2">
              <strong>BIG:</strong> {doctor.big_number}
              <button
                type="button"
                onClick={async () => {
                  setBigCheckLoading(true);
                  setBigCheckResult(null);
                  const res = await checkBigNumber(doctor.big_number ?? '');
                  setBigCheckResult(res);
                  setBigCheckLoading(false);
                }}
                disabled={bigCheckLoading || !doctor.big_number}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-[#0F172A] text-white hover:bg-[#1e293b] disabled:opacity-50"
              >
                {bigCheckLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                BIG direct controleren
              </button>
            </p>
            {bigCheckResult && (
              <div className={`mt-2 p-3 rounded-lg text-sm ${bigCheckResult.found ? 'bg-green-50 text-green-800' : bigCheckResult.formatValid ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'}`}>
                {bigCheckResult.message}
                {bigCheckResult.name && <span className="block mt-1">Naam in register: {bigCheckResult.name}</span>}
                {bigCheckResult.error && <span className="block mt-1 text-xs opacity-90">Detail: {bigCheckResult.error}</span>}
              </div>
            )}
            <p><strong>Verificatie:</strong> {doctor.verification_status}</p>
            <p><strong>Premium:</strong> {doctor.premium_status ? 'Ja' : 'Nee'}</p>
            {doctor.bio && <p><strong>Bio:</strong> {doctor.bio}</p>}
          </div>
        </div>
      )}

      {editMode && (
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
              <User className="w-5 h-5 text-[#4FA151]" />
              Persoonlijke gegevens
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volledige naam</label>
              <input
                type="text"
                value={profile?.full_name ?? ''}
                onChange={(e) => setProfile((p) => (p ? { ...p, full_name: e.target.value || null } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefoonnummer</label>
              <input
                type="tel"
                value={profile?.phone ?? ''}
                onChange={(e) => setProfile((p) => (p ? { ...p, phone: e.target.value || null } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mailadres</label>
              <input
                type="email"
                value={(profile as Profile)?.email ?? ''}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#4FA151]" />
              Professionele gegevens
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BIG-nummer</label>
              <input
                type="text"
                value={doctor.big_number ?? ''}
                onChange={(e) => setDoctor((d) => (d ? { ...d, big_number: e.target.value } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                placeholder="123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={doctor.bio ?? ''}
                onChange={(e) => setDoctor((d) => (d ? { ...d, bio: e.target.value || null } : null))}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                placeholder="Vertel iets over uzelf en uw ervaring..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialisaties (kommagescheiden)</label>
              <input
                type="text"
                value={specialtiesStr}
                onChange={(e) =>
                  setDoctor((d) =>
                    d ? { ...d, specialties: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } : null
                  )
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                placeholder="Bedrijfsgeneeskunde, Verzekeringsgeneeskunde"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Regio's (kommagescheiden)</label>
              <input
                type="text"
                value={regionsStr}
                onChange={(e) =>
                  setDoctor((d) =>
                    d ? { ...d, regions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } : null
                  )
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                placeholder="Amsterdam, Utrecht, Rotterdam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uurtarief (€)</label>
              <input
                type="number"
                min={0}
                step={5}
                value={doctor.hourly_rate ?? ''}
                onChange={(e) =>
                  setDoctor((d) => (d ? { ...d, hourly_rate: e.target.value === '' ? null : parseFloat(e.target.value) } : null))
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                placeholder="125"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beschikbaarheid</label>
              <textarea
                value={doctor.availability_text ?? ''}
                onChange={(e) => setDoctor((d) => (d ? { ...d, availability_text: e.target.value || null } : null))}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                placeholder="Bijv: Beschikbaar vanaf 1 april, 3 dagen per week"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-amber-50">
            <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              Admin: verificatie & premium
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verificatiestatus</label>
              <select
                value={doctor.verification_status ?? 'UNVERIFIED'}
                onChange={(e) =>
                  setDoctor((d) =>
                    d ? { ...d, verification_status: e.target.value as Doctor['verification_status'] } : null
                  )
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              >
                {VERIFICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'VERIFIED' ? 'Geverifieerd' : s === 'PENDING' ? 'In behandeling' : s === 'REJECTED' ? 'Afgewezen' : 'Niet geverifieerd'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reden (bij afwijzing)</label>
              <input
                type="text"
                value={doctor.verification_reason ?? ''}
                onChange={(e) => setDoctor((d) => (d ? { ...d, verification_reason: e.target.value || null } : null))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                placeholder="Optioneel"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(doctor.premium_status)}
                  onChange={(e) => setDoctor((d) => (d ? { ...d, premium_status: e.target.checked } : null))}
                  className="rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
                />
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Premium-artsenaccount</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Premium tot (datum)</label>
              <input
                type="date"
                value={doctor.premium_until ? doctor.premium_until.slice(0, 10) : ''}
                onChange={(e) =>
                  setDoctor((d) => (d ? { ...d, premium_until: e.target.value ? new Date(e.target.value).toISOString() : null } : null))
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
              />
            </div>
          </div>
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
            onClick={() => navigate('/admin/artsen')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
        </div>
      </form>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#4FA151]" />
          <h2 className="text-lg font-semibold text-[#0F172A]">Sollicitaties ({applicationsTotal})</h2>
        </div>
        <div className="p-6">
          {applications.length === 0 ? (
            <p className="text-gray-500">Geen sollicitaties.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {applications.map((app) => (
                  <li key={app.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <Link to="/admin/reacties" className="font-medium text-[#0F172A] hover:underline">
                        {app.jobs?.title || 'Opdracht'}
                      </Link>
                      <span className="ml-2 text-xs text-gray-500">
                        {app.status} · {new Date(app.created_at).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                    <Link to={`/opdrachten/${app.jobs?.id}`} className="text-sm text-[#4FA151] hover:underline">
                      Bekijk opdracht
                    </Link>
                  </li>
                ))}
              </ul>
              {applicationsTotal > APPLICATIONS_PAGE_SIZE && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {(applicationsPage - 1) * APPLICATIONS_PAGE_SIZE + 1}–
                    {Math.min(applicationsPage * APPLICATIONS_PAGE_SIZE, applicationsTotal)} van {applicationsTotal}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setApplicationsPage((p) => Math.max(1, p - 1))}
                      disabled={applicationsPage <= 1}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Vorige
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplicationsPage((p) => p + 1)}
                      disabled={applicationsPage * APPLICATIONS_PAGE_SIZE >= applicationsTotal}
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
