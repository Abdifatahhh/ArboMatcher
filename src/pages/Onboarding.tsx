import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { AlertCircle, Loader2, Briefcase, Stethoscope, Building2 } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import type { ProfessionValue } from '../lib/types';

export type OnboardingRole = 'professional' | 'company' | 'intermediary';

const ROLE_OPTIONS: { value: OnboardingRole; label: string; sub: string; icon: typeof Briefcase }[] = [
  { value: 'professional', label: 'Professional', sub: 'Vind opdrachten als arts', icon: Stethoscope },
  { value: 'company', label: 'Bedrijf', sub: 'Plaats een opdracht', icon: Building2 },
  { value: 'intermediary', label: 'Intermediair', sub: 'Plaats opdrachten voor klanten', icon: Briefcase },
];

const PROFESSION_OPTIONS: { value: ProfessionValue; label: string }[] = [
  { value: 'bedrijfsarts', label: 'Bedrijfsarts' },
  { value: 'arbo_arts', label: 'Arbo-arts' },
  { value: 'verzekeringsarts', label: 'Verzekeringsarts' },
  { value: 'casemanager_verzuim', label: 'Casemanager verzuim' },
];

const NEEDS_BIG: ProfessionValue[] = ['bedrijfsarts', 'arbo_arts', 'verzekeringsarts'];

export default function Onboarding() {
  const { profile, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [professionStep, setProfessionStep] = useState(2);
  const [profession, setProfession] = useState<ProfessionValue | null>(null);
  const [bigNumber, setBigNumber] = useState('');
  const [rcmNumber, setRcmNumber] = useState('');

  const [orgCompanyName, setOrgCompanyName] = useState('');
  const [orgKvk, setOrgKvk] = useState('');
  const [orgContactPerson, setOrgContactPerson] = useState('');
  const [orgBusinessEmail, setOrgBusinessEmail] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgSubmitting, setOrgSubmitting] = useState(false);
  const [roleChoosing, setRoleChoosing] = useState(false);
  const [backToRoleLoading, setBackToRoleLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (!profile) {
      setLoading(true);
      return;
    }
    if (profile.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (profile.onboarding_completed === true) {
      redirectByRole(profile.role);
      return;
    }
    setLoading(false);
  }, [user, profile, navigate]);

  const redirectByRole = (role: string) => {
    if (role === 'professional' || role === 'ARTS') navigate('/arts/dashboard', { replace: true });
    else if (role === 'company' || role === 'OPDRACHTGEVER') navigate('/opdrachtgever/dashboard', { replace: true });
    else if (role === 'intermediary') navigate('/intermediair/dashboard', { replace: true });
    else navigate('/', { replace: true });
  };

  if (profile?.role === 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FAF4]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4FA151] border-t-transparent" />
      </div>
    );
  }

  if (profile?.onboarding_completed === true) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F4FAF4] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4FA151] border-t-transparent" />
        <p className="text-gray-600">Doorsturen...</p>
      </div>
    );
  }

  const showRoleStep = profile?.role === 'onboarding' || profile?.role === 'OPDRACHTGEVER';

  const handleRoleChoose = async (role: OnboardingRole) => {
    if (!user?.id || roleChoosing) return;
    setError('');
    setRoleChoosing(true);
    const { error: upErr } = await supabase.from('profiles').update({ role }).eq('id', user.id);
    if (upErr) {
      setError(upErr.message);
      setRoleChoosing(false);
      return;
    }
    if (role === 'professional') {
      const { data: existing } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
      if (!existing) {
        await supabase.from('professionals').insert({
          user_id: user.id,
          verification_status: 'UNVERIFIED',
          doctor_plan: 'GRATIS',
          specialties: [],
          regions: [],
        });
      }
    }
    await refreshProfile();
    setRoleChoosing(false);
  };

  const handleBackToRoleChoice = async () => {
    if (!user?.id || backToRoleLoading) return;
    setError('');
    setBackToRoleLoading(true);
    const { error: upErr } = await supabase.from('profiles').update({ role: 'onboarding' }).eq('id', user.id);
    if (upErr) {
      setError(upErr.message);
      setBackToRoleLoading(false);
      return;
    }
    setProfessionStep(2);
    setProfession(null);
    setBigNumber('');
    setRcmNumber('');
    setOrgCompanyName('');
    setOrgKvk('');
    setOrgContactPerson('');
    setOrgBusinessEmail('');
    setOrgPhone('');
    setOrgWebsite('');
    await refreshProfile();
    setBackToRoleLoading(false);
  };

  const handleProfessionalStep2Next = () => {
    if (!profession) {
      setError('Kies een beroep');
      return;
    }
    setError('');
    setProfessionStep(3);
  };

  const saveProfessionalAndComplete = async () => {
    if (!user?.id) return;
    setError('');
    if (profession && NEEDS_BIG.includes(profession)) {
      const digits = bigNumber.replace(/\D/g, '');
      if (digits.length < 8) {
        setError('BIG-nummer moet minimaal 8 cijfers bevatten');
        return;
      }
    }
    setLoading(true);
    const { data: proRow } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
    const bigVal = profession && NEEDS_BIG.includes(profession) ? bigNumber.replace(/\D/g, '').trim() || null : null;
    const rcmVal = rcmNumber.trim() || null;
    if (proRow) {
      await supabase.from('professionals').update({
        profession: profession || undefined,
        big_number: bigVal,
        rcm_number: rcmVal,
      }).eq('id', proRow.id);
    } else {
      await supabase.from('professionals').insert({
        user_id: user.id,
        profession: profession || undefined,
        big_number: bigVal,
        rcm_number: rcmVal,
        verification_status: 'UNVERIFIED',
        doctor_plan: 'GRATIS',
        specialties: [],
        regions: [],
      });
    }
    const { error: upErr } = await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    if (upErr) {
      setError(upErr.message);
      setLoading(false);
      return;
    }
    await refreshProfile();
    setLoading(false);
    navigate('/arts/dashboard', { replace: true });
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !profile) return;
    const type = profile.role === 'intermediary' ? 'intermediary' : 'company';
    if (!orgCompanyName.trim()) {
      setError('Bedrijfsnaam is verplicht');
      return;
    }
    if (!orgKvk.trim()) {
      setError('KvK-nummer is verplicht');
      return;
    }
    setOrgSubmitting(true);
    setError('');
    const { error: insErr } = await supabase.from('organizations').upsert({
      profile_id: user.id,
      organization_type: type,
      company_name: orgCompanyName.trim(),
      kvk_number: orgKvk.trim(),
      contact_person: orgContactPerson.trim() || null,
      business_email: orgBusinessEmail.trim() || null,
      phone: orgPhone.trim() || null,
      website: orgWebsite.trim() || null,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id' });
    if (insErr) {
      setError(insErr.message);
      setOrgSubmitting(false);
      return;
    }
    const { error: empErr } = await supabase.from('employers').upsert({
      user_id: user.id,
      company_name: orgCompanyName.trim(),
      kvk: orgKvk.trim() || null,
      website: orgWebsite.trim() || null,
      billing_email: orgBusinessEmail.trim() || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (empErr) {
      setError(empErr.message);
      setOrgSubmitting(false);
      return;
    }
    const { error: upErr } = await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    if (upErr) {
      setError(upErr.message);
      setOrgSubmitting(false);
      return;
    }
    await refreshProfile();
    setOrgSubmitting(false);
    if (type === 'intermediary') navigate('/intermediair/dashboard', { replace: true });
    else navigate('/opdrachtgever/dashboard', { replace: true });
  };

  if (user && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F4FAF4] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4FA151] border-t-transparent" />
        <p className="text-gray-600">Profiel laden...</p>
      </div>
    );
  }


  const role = profile?.role;
  const isProfessional = role === 'professional' || role === 'ARTS';
  const isCompany = role === 'company' || role === 'OPDRACHTGEVER';
  const isIntermediary = role === 'intermediary';

  if (showRoleStep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-[#F4FAF4] to-white flex flex-col items-center justify-center pt-8 pb-10 md:pt-12 md:pb-16 px-4 md:px-6">
        <div className="mb-6 md:mb-10">
          <LogoText theme="light" className="text-2xl md:text-3xl" />
        </div>
        <div className="w-full max-w-3xl bg-white rounded-2xl md:rounded-3xl shadow-lg shadow-emerald-900/5 border border-emerald-100/80 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">Hoe wil je ArboMatcher gebruiken?</h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8">Kies je rol om verder te gaan.</p>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={roleChoosing}
                  onClick={() => handleRoleChoose(opt.value)}
                  className="group p-6 md:p-8 rounded-2xl border-2 border-gray-200 hover:border-[#4FA151] hover:bg-emerald-50/50 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center disabled:opacity-50 min-h-[180px] md:min-h-[220px] justify-center"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-100/80 group-hover:bg-[#4FA151]/15 flex items-center justify-center mb-4 md:mb-5 transition-colors">
                    <Icon className="w-7 h-7 md:w-9 md:h-9 text-[#4FA151]" strokeWidth={2} />
                  </div>
                  <span className="font-bold text-[#0F172A] text-base md:text-lg lg:text-xl">{opt.label}</span>
                  <span className="text-sm md:text-base text-gray-600 mt-1.5 md:mt-2 leading-snug">{opt.sub}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-8 md:mt-10 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Alle medische professionals worden gecontroleerd via het BIG-register.
          </p>
        </div>
      </div>
    );
  }

  if (!profile || (!isProfessional && !isCompany && !isIntermediary)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4FAF4] px-4">
        <p className="text-gray-600">Geen onboarding beschikbaar voor dit account.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-[#4FA151] hover:underline">Naar start</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F4FAF4] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4FA151] border-t-transparent" />
        <p className="text-gray-600">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-[#F4FAF4] to-white flex flex-col items-center justify-center pt-8 pb-10 md:pt-12 md:pb-16 px-4 md:px-6">
      <div className="mb-6 md:mb-10">
        <LogoText theme="light" className="text-2xl md:text-3xl" />
      </div>

      {isProfessional && (
        <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-lg shadow-emerald-900/5 border border-emerald-100/80 p-6 md:p-10">
          {professionStep === 2 && (
            <>
              <button type="button" onClick={handleBackToRoleChoice} disabled={backToRoleLoading} className="text-[#4FA151] hover:underline font-medium mb-6 md:mb-8 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base">
                {backToRoleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}← Terug naar rolkeuze
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">Kies je beroep</h1>
              <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8">Selecteer het beroep dat bij je past.</p>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {PROFESSION_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => { setProfession(p.value); setError(''); }}
                    className={`w-full flex items-center gap-4 p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                      profession === p.value
                        ? 'border-[#4FA151] bg-emerald-50/60 shadow-sm'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50/80'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      profession === p.value ? 'border-[#4FA151] bg-[#4FA151]/10' : 'border-gray-300'
                    }`}>
                      {profession === p.value && <div className="w-3 h-3 rounded-full bg-[#4FA151]" />}
                    </div>
                    <span className="font-semibold text-[#0F172A] text-base md:text-lg">{p.label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleProfessionalStep2Next}
                className="w-full bg-[#4FA151] text-white py-4 rounded-2xl font-semibold text-base md:text-lg hover:bg-[#3E8E45] transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                Volgende
              </button>
            </>
          )}

          {professionStep === 3 && (
            <>
              <button type="button" onClick={() => setProfessionStep(2)} className="text-[#4FA151] hover:underline font-medium mb-6 md:mb-8 text-sm md:text-base">
                ← Terug naar beroep
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">Validatie</h1>
              {profession && NEEDS_BIG.includes(profession) && (
                <>
                  <p className="text-gray-600 text-base mb-4">Vul je BIG-nummer in (alleen cijfers, minimaal 8).</p>
                  <div className="mb-4">
                    <label htmlFor="bigNumber" className="block text-sm font-medium text-gray-700 mb-2">BIG-nummer *</label>
                    <input
                      id="bigNumber"
                      type="text"
                      inputMode="numeric"
                      value={bigNumber}
                      onChange={(e) => setBigNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                      placeholder="Alleen cijfers, min. 8"
                    />
                  </div>
                </>
              )}
              {profession === 'casemanager_verzuim' && (
                <>
                  <p className="text-gray-600 text-base mb-4">Optioneel: vul je RCM-nummer in.</p>
                  <div className="mb-4">
                    <label htmlFor="rcmNumber" className="block text-sm font-medium text-gray-700 mb-2">RCM-nummer (optioneel)</label>
                    <input
                      id="rcmNumber"
                      type="text"
                      value={rcmNumber}
                      onChange={(e) => setRcmNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                      placeholder="RCM-nummer"
                    />
                  </div>
                </>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <button
                type="button"
                disabled={loading || (profession && NEEDS_BIG.includes(profession) && bigNumber.replace(/\D/g, '').length < 8)}
                onClick={saveProfessionalAndComplete}
                className="w-full bg-[#4FA151] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[#3E8E45] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Bezig...</span> : 'Registratie voltooien'}
              </button>
            </>
          )}
        </div>
      )}

      {(isCompany || isIntermediary) && (
        <div className="w-full max-w-xl bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-8">
          <button type="button" onClick={handleBackToRoleChoice} disabled={backToRoleLoading} className="text-[#4FA151] hover:underline font-medium mb-4 md:mb-6 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base">
            {backToRoleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}← Terug naar rolkeuze
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
            {isIntermediary ? 'Gegevens intermediair' : 'Bedrijfsgegevens'}
          </h1>
          <p className="text-gray-600 mb-6">Vul de gegevens van je organisatie in. KvK-nummer is verplicht en kan later niet worden gewijzigd.</p>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleOrgSubmit} className="space-y-4">
            <div>
              <label htmlFor="orgCompanyName" className="block text-sm font-medium text-gray-700 mb-2">Bedrijfsnaam *</label>
              <input id="orgCompanyName" type="text" required value={orgCompanyName} onChange={(e) => setOrgCompanyName(e.target.value)} className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]" placeholder="Bedrijfsnaam" />
            </div>
            <div>
              <label htmlFor="orgKvk" className="block text-sm font-medium text-gray-700 mb-2">KvK-nummer *</label>
              <input id="orgKvk" type="text" required value={orgKvk} onChange={(e) => setOrgKvk(e.target.value)} className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]" placeholder="Bijv. 12345678" />
              <p className="mt-1 text-xs text-gray-500">Na opslaan niet meer wijzigbaar.</p>
            </div>
            <div>
              <label htmlFor="orgContactPerson" className="block text-sm font-medium text-gray-700 mb-2">Contactpersoon</label>
              <input id="orgContactPerson" type="text" value={orgContactPerson} onChange={(e) => setOrgContactPerson(e.target.value)} className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]" placeholder="Naam contactpersoon" />
            </div>
            <div>
              <label htmlFor="orgBusinessEmail" className="block text-sm font-medium text-gray-700 mb-2">Zakelijk e-mailadres</label>
              <input id="orgBusinessEmail" type="email" value={orgBusinessEmail} onChange={(e) => setOrgBusinessEmail(e.target.value)} className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]" placeholder="zakelijk@bedrijf.nl" />
            </div>
            <div>
              <label htmlFor="orgPhone" className="block text-sm font-medium text-gray-700 mb-2">Telefoonnummer</label>
              <input id="orgPhone" type="tel" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]" placeholder="06-12345678" />
            </div>
            <div>
              <label htmlFor="orgWebsite" className="block text-sm font-medium text-gray-700 mb-2">Website (optioneel)</label>
              <input id="orgWebsite" type="url" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]" placeholder="https://..." />
            </div>
            <button type="submit" disabled={orgSubmitting} className="w-full bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50">
              {orgSubmitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Opslaan...</span> : 'Opslaan en doorgaan'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
