import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { ConsentPreferences, Doctor, Profile, ProfessionType } from '../../lib/types';
import { CONSENT_KEYS, EXTENDED_SETTINGS } from '../../components/PrivacyConsent';
import { Save, AlertCircle, FileText, Upload, Settings, BadgeCheck, UserRound, Briefcase, Euro, CalendarClock, ShieldCheck, ChevronDown } from 'lucide-react';

const PROFESSION_TYPES: { value: ProfessionType; label: string }[] = [
  { value: 'BEDRIJFSARTS', label: 'Bedrijfsarts' },
  { value: 'ARBO_ARTS', label: 'Arbo-arts' },
  { value: 'VERZEKERINGSARTS', label: 'Verzekeringsarts' },
  { value: 'POB', label: 'Praktijkondersteuner bedrijfsarts (POB)' },
  { value: 'CASEMANAGER_VERZUIM', label: 'Casemanager verzuim' },
];

const CV_BUCKET = 'doctor-cvs';

export default function ArtsProfiel({ variant }: { variant?: 'default' | 'onboarding' }) {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [professional, setProfessional] = useState<Partial<Doctor>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [message, setMessage] = useState('');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentToggles, setConsentToggles] = useState<boolean[]>(CONSENT_KEYS.map(() => false));
  const [sectionsOpen, setSectionsOpen] = useState({
    personal: true,
    professional: true,
    privacy: false,
  });
  const isOnboarding = variant === 'onboarding';

  const completionChecks = [
    Boolean(profile.full_name?.trim()),
    Boolean(profile.phone?.trim()),
    Boolean(professional.profession_type),
    professional.profession_type === 'POB' || professional.profession_type === 'CASEMANAGER_VERZUIM'
      ? Boolean(professional.rcm_number?.trim())
      : Boolean(professional.big_number?.trim()),
    Boolean(professional.bio?.trim()),
    (professional.specialties?.length || 0) > 0,
    (professional.regions?.length || 0) > 0,
    professional.hourly_rate != null,
    Boolean(professional.availability_text?.trim()),
    Boolean(professional.cv_url),
  ];
  const completedCount = completionChecks.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / completionChecks.length) * 100);
  const verificationStatus = professional.verification_status || 'UNVERIFIED';
  const verificationText =
    verificationStatus === 'VERIFIED'
      ? 'Geverifieerd'
      : verificationStatus === 'PENDING'
      ? 'In behandeling'
      : verificationStatus === 'REJECTED'
      ? 'Afgewezen'
      : 'Nog niet geverifieerd';
  const verificationClass =
    verificationStatus === 'VERIFIED'
      ? 'bg-green-50 text-green-700 border-green-200'
      : verificationStatus === 'PENDING'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : verificationStatus === 'REJECTED'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-slate-50 text-slate-700 border-slate-200';

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    let doctorData = (await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()).data;

    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const metaBig = meta?.big_number ? String(meta.big_number).trim() : '';
    const metaProfession = meta?.profession_type ? String(meta.profession_type).trim() : '';
    const metaRcm = meta?.rcm_number ? String(meta.rcm_number).trim() : '';

    if (doctorData && (metaBig || metaProfession || metaRcm)) {
      const needBig = (!doctorData.big_number || doctorData.big_number === '') && metaBig;
      const needProf = !doctorData.profession_type && metaProfession;
      const needRcm = (doctorData.rcm_number == null || doctorData.rcm_number === '') && metaRcm;
      if (needBig || needProf || needRcm) {
        const updates: { big_number?: string | null; profession_type?: string | null; rcm_number?: string | null } = {};
        if (needBig) updates.big_number = metaBig;
        if (needProf) updates.profession_type = metaProfession;
        if (needRcm) updates.rcm_number = metaRcm;
        const { data: updated } = await supabase
          .from('professionals')
          .update(updates)
          .eq('id', doctorData.id)
          .select()
          .single();
        if (updated) doctorData = updated;
      }
    } else if (!doctorData && (metaBig || metaProfession)) {
      const { data: inserted } = await supabase
        .from('professionals')
        .insert({
          user_id: user.id,
          big_number: metaBig || null,
          profession_type: metaProfession || null,
          rcm_number: metaRcm || null,
          verification_status: metaBig && metaBig.length >= 8 ? 'PENDING' : 'UNVERIFIED',
          plan: 'GRATIS',
          specialties: [],
          regions: [],
        })
        .select()
        .single();
      if (inserted) doctorData = inserted;
    }

    if (profileData) setProfile(profileData);
    if (doctorData) setProfessional(doctorData);

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');

    try {
      await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone
        })
        .eq('id', user.id);

      if (professional.id) {
        await supabase
          .from('professionals')
          .update({
            big_number: professional.big_number?.trim() || null,
            profession_type: professional.profession_type,
            rcm_number: professional.rcm_number?.trim() || null,
            employment_type: professional.employment_type ?? null,
            kvk: professional.kvk?.replace(/\D/g, '').slice(0, 8) || null,
            company_name: professional.company_name?.trim() || null,
            bio: professional.bio,
            specialties: professional.specialties,
            regions: professional.regions,
            hourly_rate: professional.hourly_rate,
            availability_text: professional.availability_text,
            cv_url: professional.cv_url,
            verification_status: professional.verification_status === 'UNVERIFIED' && (professional.profession_type === 'POB' || professional.profession_type === 'CASEMANAGER_VERZUIM') ? professional.verification_status : (professional.verification_status === 'UNVERIFIED' && (professional.big_number?.trim() || '').length === 11 ? 'PENDING' : professional.verification_status)
          })
          .eq('id', professional.id);
      } else {
        await supabase
          .from('professionals')
          .insert({
            user_id: user.id,
            big_number: professional.big_number?.trim() || null,
            profession_type: professional.profession_type,
            rcm_number: professional.rcm_number?.trim() || null,
            employment_type: professional.employment_type ?? null,
            kvk: professional.kvk?.replace(/\D/g, '').slice(0, 8) || null,
            company_name: professional.company_name?.trim() || null,
            bio: professional.bio,
            specialties: professional.specialties || [],
            regions: professional.regions || [],
            hourly_rate: professional.hourly_rate,
            availability_text: professional.availability_text,
            cv_url: professional.cv_url,
            verification_status: (professional.big_number?.trim() || '').length === 11 ? 'PENDING' : 'UNVERIFIED',
            plan: 'GRATIS'
          });
      }

      await refreshProfile();
      setMessage('Profiel succesvol opgeslagen!');
      fetchData();
      window.dispatchEvent(new CustomEvent('arts-profile-saved'));
    } catch (error) {
      setMessage('Er is een fout opgetreden bij het opslaan');
    }

    setSaving(false);
  };

  const CV_ACCEPT = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const openConsentModal = () => {
    setConsentToggles(CONSENT_KEYS.map((k) => profile.consent_preferences?.[k] === true));
    setShowConsentModal(true);
  };

  const saveConsentPreferences = async () => {
    if (!user) return;
    const consent_preferences: ConsentPreferences = {
      main: consentToggles.some(Boolean),
      inform_candidate: consentToggles[0] ?? false,
      share_profile_cv: consentToggles[1] ?? false,
      products_services: consentToggles[2] ?? false,
      share_sister_companies: consentToggles[3] ?? false,
      newsletter: consentToggles[4] ?? false,
      feedback_reviews: consentToggles[5] ?? false,
      relevant_content: consentToggles[6] ?? false,
    };
    await supabase.from('profiles').update({ consent_preferences }).eq('id', user.id);
    setProfile({ ...profile, consent_preferences });
    await refreshProfile();
    setShowConsentModal(false);
    setMessage('Voorkeuren opgeslagen.');
  };

  const setConsentToggle = (index: number, value: boolean) => {
    const next = [...consentToggles];
    next[index] = value;
    setConsentToggles(next);
  };

  const toggleSection = (section: 'personal' | 'professional' | 'privacy') => {
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!CV_ACCEPT.includes(file.type)) {
      setMessage('Alleen PDF of Word (.doc, .docx) is toegestaan.');
      return;
    }
    setUploadingCv(true);
    setMessage('');
    try {
      const ext = file.name.split('.').pop() || 'pdf';
      const path = `${user.id}/cv-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(CV_BUCKET).upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from(CV_BUCKET).getPublicUrl(path);
      setProfessional({ ...professional, cv_url: urlData.publicUrl });
      setMessage('CV geüpload. Klik Opslaan om te bevestigen.');
    } catch (err: any) {
      setMessage(err?.message || 'Upload mislukt. Controleer of de bucket bestaat.');
    }
    setUploadingCv(false);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={isOnboarding ? 'max-w-2xl mx-auto' : 'p-4 md:p-6 max-w-5xl'}>
      <h1 className={`font-bold text-[#0F172A] ${isOnboarding ? 'text-2xl text-center mb-6' : 'text-3xl mb-4'}`}>
        {isOnboarding ? 'Voltooi uw profiel' : 'Mijn Profiel'}
      </h1>

      {!isOnboarding && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Profielstatus</p>
              <h2 className="text-xl font-bold text-[#0F172A]">Maak uw profiel compleet voor betere matches</h2>
              <p className="text-slate-500 mt-1">
                Volledigheid: <span className="font-semibold text-[#0F172A]">{completionPercent}%</span>
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold ${verificationClass}`}>
              <ShieldCheck className="w-4 h-4" />
              BIG-status: {verificationText}
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 flex items-center gap-2">
              <UserRound className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">Persoonsgegevens</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">Verificatie</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">Specialisaties</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">Beschikbaarheid</span>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          message.includes('succesvol') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <AlertCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
            message.includes('succesvol') ? 'text-green-600' : 'text-red-600'
          }`} />
          <p className={message.includes('succesvol') ? 'text-green-900' : 'text-red-900'}>{message}</p>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-7 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          {!isOnboarding ? (
            <button
              type="button"
              onClick={() => toggleSection('personal')}
              className="w-full flex items-start justify-between text-left"
            >
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Persoonlijke gegevens</h2>
                <p className="text-sm text-slate-500">Deze gegevens gebruiken we voor communicatie en accountbeheer.</p>
              </div>
              <ChevronDown className={`w-5 h-5 mt-1 text-slate-500 transition-transform ${sectionsOpen.personal ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">Persoonlijke gegevens</h2>
              <p className="text-sm text-slate-500">Deze gegevens gebruiken we voor communicatie en accountbeheer.</p>
            </>
          )}
          {(isOnboarding || sectionsOpen.personal) && <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Volledige naam *
              </label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Telefoonnummer
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed"
              />
            </div>
          </div>}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          {!isOnboarding ? (
            <button
              type="button"
              onClick={() => toggleSection('professional')}
              className="w-full flex items-start justify-between text-left"
            >
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Professionele gegevens</h2>
                <p className="text-sm text-slate-500">Dit zien opdrachtgevers bij matches en reacties op opdrachten.</p>
              </div>
              <ChevronDown className={`w-5 h-5 mt-1 text-slate-500 transition-transform ${sectionsOpen.professional ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">Professionele gegevens</h2>
              <p className="text-sm text-slate-500">Dit zien opdrachtgevers bij matches en reacties op opdrachten.</p>
            </>
          )}
          {(isOnboarding || sectionsOpen.professional) && <div className="space-y-4 mt-4">
            {professional.profession_type && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Beroep</label>
                <p className="text-[#0F172A] font-medium">
                  {PROFESSION_TYPES.find((p) => p.value === professional.profession_type)?.label ?? professional.profession_type}
                </p>
              </div>
            )}
            {(professional.profession_type === 'CASEMANAGER_VERZUIM' || professional.rcm_number != null) && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">RCM-nummer (optioneel)</label>
                <input
                  type="text"
                  value={professional.rcm_number || ''}
                  onChange={(e) => setProfessional({ ...professional, rcm_number: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                  placeholder="RCM-nummer"
                />
              </div>
            )}
            {(!professional.profession_type || (professional.profession_type !== 'CASEMANAGER_VERZUIM' && professional.profession_type !== 'POB')) && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  BIG-nummer * (11 cijfers) {professional.verification_status && professional.profession_type !== 'CASEMANAGER_VERZUIM' && professional.profession_type !== 'POB' && (
                    <span className={`ml-2 text-sm ${
                      professional.verification_status === 'VERIFIED' ? 'text-green-600' :
                      professional.verification_status === 'PENDING' ? 'text-yellow-600' :
                      professional.verification_status === 'REJECTED' ? 'text-red-600' :
                      'text-slate-600'
                    }`}>
                      ({professional.verification_status === 'VERIFIED' ? 'Geverifieerd' :
                        professional.verification_status === 'PENDING' ? 'In behandeling' :
                        professional.verification_status === 'REJECTED' ? 'Afgewezen' :
                        'Niet geverifieerd'})
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap items-start gap-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    value={professional.big_number || ''}
                    onChange={(e) => setProfessional({ ...professional, big_number: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    disabled={(professional.big_number || '').replace(/\D/g, '').length === 11}
                    className="w-full max-w-xs px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                    placeholder="11 cijfers"
                  />
                  {(professional.big_number || '').replace(/\D/g, '').length === 11 && (
                    <div className="text-sm text-slate-700">
                      <p>BIG-nummer wijzigen?</p>
                      <p>Neem <Link to="/contact" className="text-[#0F172A] hover:underline">contact op</Link> met de klantenservice.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(professional.employment_type === 'FREELANCE_ZZP' || (professional.kvk || '').replace(/\D/g, '').length === 8) && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  KvK-nummer (ZZP)
                </label>
                <div className="flex flex-wrap items-start gap-4">
                  <input
                    type="text"
                    value={professional.kvk || ''}
                    onChange={(e) => setProfessional({ ...professional, kvk: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                    disabled={(professional.kvk || '').replace(/\D/g, '').length === 8}
                    className="w-full max-w-xs px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                    placeholder="8 cijfers"
                  />
                  {(professional.kvk || '').replace(/\D/g, '').length === 8 && (
                    <div className="text-sm text-slate-700">
                      <p>KvK-nummer wijzigen?</p>
                      <p>Neem <Link to="/contact" className="text-[#0F172A] hover:underline">contact op</Link> met de klantenservice.</p>
                    </div>
                  )}
                </div>
                {professional.company_name && (
                  <p className="mt-1 text-sm text-slate-500">Bedrijfsnaam: {professional.company_name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Bio
              </label>
              <textarea
                value={professional.bio || ''}
                onChange={(e) => setProfessional({ ...professional, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                placeholder="Vertel iets over uzelf en uw ervaring..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Specialisaties (kommagescheiden)
              </label>
              <input
                type="text"
                value={professional.specialties?.join(', ') || ''}
                onChange={(e) => setProfessional({ ...professional, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                placeholder="Bedrijfsgeneeskunde, Verzekeringsgeneeskunde"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Regio's (kommagescheiden)
              </label>
              <input
                type="text"
                value={professional.regions?.join(', ') || ''}
                onChange={(e) => setProfessional({ ...professional, regions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                placeholder="Amsterdam, Utrecht, Rotterdam"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Uurtarief (€)
              </label>
              <input
                type="number"
                value={professional.hourly_rate || ''}
                onChange={(e) => setProfessional({ ...professional, hourly_rate: e.target.value === '' ? null : parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                placeholder="125"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Beschikbaarheid
              </label>
              <textarea
                value={professional.availability_text || ''}
                onChange={(e) => setProfessional({ ...professional, availability_text: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                placeholder="Bijv: Beschikbaar vanaf 1 april, 3 dagen per week"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                CV (PDF of Word)
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition text-sm">
                  <Upload className="w-4 h-4" />
                  {uploadingCv ? 'Bezig...' : 'Kies bestand'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleCvUpload}
                    disabled={uploadingCv}
                  />
                </label>
                {professional.cv_url && (
                  <a
                    href={professional.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#0F172A] hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    Huidige CV bekijken
                  </a>
                )}
              </div>
            </div>
          </div>}
        </div>

        {!isOnboarding && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <button
              type="button"
              onClick={() => toggleSection('privacy')}
              className="w-full flex items-start justify-between text-left"
            >
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Privacy & toestemming</h2>
                <p className="text-sm text-slate-600">Beheer hoe uw profiel zichtbaar is in matches en notificaties.</p>
              </div>
              <ChevronDown className={`w-5 h-5 mt-1 text-slate-500 transition-transform ${sectionsOpen.privacy ? 'rotate-180' : ''}`} />
            </button>
            {sectionsOpen.privacy && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={openConsentModal}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#0F172A] text-[#0F172A] rounded-xl font-medium hover:bg-slate-100 transition"
                >
                  <Settings className="w-4 h-4" />
                  Uitgebreide instellingen
                </button>
              </div>
            )}
          </div>
        )}

        {showConsentModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40" onClick={() => setShowConsentModal(false)}>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-[#0F172A] text-lg">Uitgebreide instellingen</h3>
              </div>
              <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
                {EXTENDED_SETTINGS.map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={consentToggles[i]}
                      onClick={() => setConsentToggle(i, !consentToggles[i])}
                      className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors flex items-center ${consentToggles[i] ? 'bg-emerald-500 justify-end' : 'bg-slate-100 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full shadow mx-0.5" />
                    </button>
                    <p className="text-sm text-[#0F172A] bg-slate-100 rounded-lg px-3 py-2 flex-1">{text}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowConsentModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition">Annuleren</button>
                <button type="button" onClick={saveConsentPreferences} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20">Instellingen opslaan</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50 shadow-lg shadow-emerald-500/20 ${isOnboarding ? '' : 'sm:w-auto'}`}
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Bezig met opslaan...' : 'Wijzigingen opslaan'}
          </button>
          {!isOnboarding && (
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Euro className="w-4 h-4" />
              Tip: complete profielen krijgen sneller reacties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
