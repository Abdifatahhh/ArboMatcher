import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { AlertCircle, Loader2, Briefcase, Stethoscope, Search } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import type { ProfessionValue } from '../lib/types';
import { searchBigByName } from '../services/bigCheckService';
import type { BigSearchResultItem, BigSearchGender } from '../services/bigCheckService';

export type OnboardingRole = 'professional' | 'opdrachtgever';

const ROLE_OPTIONS: { value: OnboardingRole; label: string; sub: string; icon: typeof Briefcase }[] = [
  { value: 'professional', label: 'Professional', sub: 'Vind opdrachten als arts', icon: Stethoscope },
  { value: 'opdrachtgever', label: 'Opdrachtgever', sub: 'Plaats opdrachten', icon: Briefcase },
];

const PROFESSION_OPTIONS: { value: ProfessionValue; label: string }[] = [
  { value: 'bedrijfsarts', label: 'Bedrijfsarts' },
  { value: 'arbo_arts', label: 'Arbo-arts' },
  { value: 'verzekeringsarts', label: 'Verzekeringsarts' },
  { value: 'pob', label: 'Praktijkondersteuner bedrijfsarts (POB)' },
  { value: 'casemanager_verzuim', label: 'Casemanager verzuim' },
];

const NEEDS_BIG: ProfessionValue[] = ['bedrijfsarts', 'arbo_arts', 'verzekeringsarts'];

const PROFESSION_TO_TYPE: Record<ProfessionValue, string> = {
  bedrijfsarts: 'BEDRIJFSARTS',
  arbo_arts: 'ARBO_ARTS',
  verzekeringsarts: 'VERZEKERINGSARTS',
  casemanager_verzuim: 'CASEMANAGER_VERZUIM',
  pob: 'POB',
};

export default function Onboarding() {
  const { profile, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [professionStep, setProfessionStep] = useState(2);
  const [profession, setProfession] = useState<ProfessionValue | null>(null);
  const [bigNumber, setBigNumber] = useState('');
  const [rcmNumber, setRcmNumber] = useState('');
  const [bigSearchGeslacht, setBigSearchGeslacht] = useState<BigSearchGender | ''>('');
  const [bigSearchVoorletters, setBigSearchVoorletters] = useState('');
  const [bigSearchAchternaam, setBigSearchAchternaam] = useState('');
  const [bigSearchGeboortedatum, setBigSearchGeboortedatum] = useState('');
  const [bigSearchResults, setBigSearchResults] = useState<BigSearchResultItem[]>([]);
  const [bigSearchPendingSelection, setBigSearchPendingSelection] = useState<BigSearchResultItem | null>(null);
  const [bigSearchLoading, setBigSearchLoading] = useState(false);
  const [bigSearchError, setBigSearchError] = useState('');

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
    if (role === 'professional') navigate('/professional/dashboard', { replace: true });
    else if (role === 'OPDRACHTGEVER') navigate('/opdrachtgever/dashboard', { replace: true });
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

  const showRoleStep = profile?.role === 'onboarding';

  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [kvkSearchResults, setKvkSearchResults] = useState<KvkSearchItem[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [kvk, setKvk] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [sector, setSector] = useState('');
  const [vestigingsnummer, setVestigingsnummer] = useState('');
  const [kvkType, setKvkType] = useState('');
  const [kvkActief, setKvkActief] = useState('');
  const [rechtsvorm, setRechtsvorm] = useState('');
  const [statutaireNaam, setStatutaireNaam] = useState('');
  const [opdrachtgeverSaving, setOpdrachtgeverSaving] = useState(false);
  const [kvkLoading, setKvkLoading] = useState(false);

  const handleRoleChoose = async (role: OnboardingRole) => {
    if (!user?.id || roleChoosing) return;
    setError('');
    setRoleChoosing(true);
    if (role === 'opdrachtgever') {
      const { error: upErr } = await supabase.from('profiles').update({ role: 'OPDRACHTGEVER' }).eq('id', user.id);
      if (upErr) {
        setError(upErr.message);
        setRoleChoosing(false);
        return;
      }
      await refreshProfile();
      setRoleChoosing(false);
      return;
    }
    const { error: upErr } = await supabase.from('profiles').update({ role: 'professional' }).eq('id', user.id);
    if (upErr) {
      setError(upErr.message);
      setRoleChoosing(false);
      return;
    }
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
    setCompanySearchQuery('');
    setKvkSearchResults([]);
    setCompanyName('');
    setKvk('');
    setBillingAddress('');
    setWebsite('');
    setSector('');
    setVestigingsnummer('');
    setKvkType('');
    setKvkActief('');
    setRechtsvorm('');
    setStatutaireNaam('');
    await refreshProfile();
    setBackToRoleLoading(false);
  };

  type KvkSearchItem = {
    kvkNummer?: string;
    vestigingsnummer?: string;
    naam?: string;
    straatnaam?: string;
    huisnummer?: string;
    huisletter?: string;
    postcode?: string;
    plaats?: string;
    actief?: string;
    type?: string;
    websites?: string[];
    sector?: string;
    statutaireNaam?: string;
    handelsnamen?: string[];
    rechtsvorm?: string;
  };

  const searchKvk = async () => {
    const trimmed = companySearchQuery.trim();
    const kvkDigits = trimmed.replace(/\D/g, '');
    if (!trimmed) return;
    setError('');
    setKvkLoading(true);
    setKvkSearchResults([]);
    try {
      const body = kvkDigits.length === 8 ? { kvkNummer: kvkDigits } : { q: trimmed };
      const { data, error: fnError } = await supabase.functions.invoke('kvk-search', { body });
      if (fnError) throw fnError;
      const resultaten = (data as { resultaten?: KvkSearchItem[] })?.resultaten ?? [];
      setKvkSearchResults(resultaten);
      if (resultaten.length === 0) setError('Geen bedrijven gevonden. Probeer een andere zoekterm of KvK-nummer.');
    } catch {
      setError('Zoeken mislukt. Probeer het later opnieuw.');
    } finally {
      setKvkLoading(false);
    }
  };

  const applyKvkResult = (item: KvkSearchItem) => {
    const naam = item.naam?.trim() ?? '';
    setCompanyName(naam);
    setKvk(item.kvkNummer ?? '');
    const adresParts = [
      [item.straatnaam, item.huisnummer, item.huisletter].filter(Boolean).join(' '),
      [item.postcode, item.plaats].filter(Boolean).join(' '),
    ].filter(Boolean);
    setBillingAddress(adresParts.join(', '));
    setVestigingsnummer(item.vestigingsnummer ?? '');
    setKvkType(item.type ?? '');
    setKvkActief(item.actief ?? '');
    setRechtsvorm(item.rechtsvorm ?? '');
    setStatutaireNaam(item.statutaireNaam ?? '');
    setWebsite(Array.isArray(item.websites) && item.websites[0] ? item.websites[0] : '');
    setSector(item.sector ?? '');
    setKvkSearchResults([]);
    setCompanySearchQuery('');
  };

  const saveOpdrachtgeverAndComplete = async () => {
    if (!user?.id) return;
    const name = companyName.trim();
    const kvkDigits = kvk.replace(/\D/g, '');
    if (kvkDigits.length !== 8) {
      setError('Vul een geldig KvK-nummer in (8 cijfers)');
      return;
    }
    if (!name) {
      setError('Vul een bedrijfsnaam in of haal deze op via het KvK-nummer');
      return;
    }
    setError('');
    setOpdrachtgeverSaving(true);
    const { data: existing } = await supabase.from('employers').select('id').eq('user_id', user.id).maybeSingle();
    const employerPayload = {
      company_name: name,
      kvk: kvkDigits,
      billing_address: billingAddress.trim() || null,
      website: website.trim() || null,
      sector: sector.trim() || null,
      vestigingsnummer: vestigingsnummer.trim() || null,
      kvk_type: kvkType.trim() || null,
      kvk_actief: kvkActief === 'Ja' ? true : kvkActief === 'Nee' ? false : null,
      rechtsvorm: rechtsvorm.trim() || null,
      statutaire_naam: statutaireNaam.trim() || null,
    };
    if (existing) {
      const { error: upErr } = await supabase.from('employers').update(employerPayload).eq('id', existing.id);
      if (upErr) {
        setError(upErr.message);
        setOpdrachtgeverSaving(false);
        return;
      }
    } else {
      const { error: inErr } = await supabase.from('employers').insert({
        user_id: user.id,
        ...employerPayload,
      });
      if (inErr) {
        setError(inErr.message);
        setOpdrachtgeverSaving(false);
        return;
      }
    }
    const { error: upErr } = await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    if (upErr) {
      setError(upErr.message);
      setOpdrachtgeverSaving(false);
      return;
    }
    await refreshProfile();
    setOpdrachtgeverSaving(false);
    navigate('/opdrachtgever/dashboard', { replace: true });
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
      if (digits.length !== 11) {
        setError('BIG-nummer moet 11 cijfers bevatten');
        return;
      }
    }
    setLoading(true);
    const { data: proRow } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
    const bigVal = profession && NEEDS_BIG.includes(profession) ? bigNumber.replace(/\D/g, '').trim() || null : null;
    const rcmVal = rcmNumber.trim() || null;
    const professionType = profession ? PROFESSION_TO_TYPE[profession] : null;
    if (proRow) {
      await supabase.from('professionals').update({
        profession: profession || undefined,
        profession_type: professionType,
        big_number: bigVal,
        rcm_number: rcmVal,
      }).eq('id', proRow.id);
    } else {
      await supabase.from('professionals').insert({
        user_id: user.id,
        profession: profession || undefined,
        profession_type: professionType,
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
    navigate('/professional/dashboard', { replace: true });
  };

  if (user && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F4FAF4] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4FA151] border-t-transparent" />
      </div>
    );
  }


  const role = profile?.role;
  const isProfessional = role === 'professional';
  const isOpdrachtgever = role === 'OPDRACHTGEVER';

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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

  if (!profile || (!isProfessional && !isOpdrachtgever)) {
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
                  <p className="text-gray-600 text-base mb-4">Vul je BIG-nummer in of zoek het op met je achternaam.</p>
                  <div className="mb-6 p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl">
                    <p className="text-sm font-medium text-[#0F172A] mb-3">Zoek je BIG-nummer op (zoals op bigregister.nl)</p>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1.5">Geslacht *</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="bigSearchGeslacht"
                              checked={bigSearchGeslacht === 'Man'}
                              onChange={() => { setBigSearchGeslacht('Man'); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                              className="text-[#4FA151] focus:ring-[#4FA151]"
                            />
                            <span className="text-sm">Man</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="bigSearchGeslacht"
                              checked={bigSearchGeslacht === 'Vrouw'}
                              onChange={() => { setBigSearchGeslacht('Vrouw'); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                              className="text-[#4FA151] focus:ring-[#4FA151]"
                            />
                            <span className="text-sm">Vrouw</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
                      <input
                        type="text"
                        value={bigSearchVoorletters}
                        onChange={(e) => { setBigSearchVoorletters(e.target.value.toUpperCase().slice(0, 10)); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                        placeholder="Voorletters"
                        className="sm:col-span-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                      />
                      <input
                        type="text"
                        value={bigSearchAchternaam}
                        onChange={(e) => { setBigSearchAchternaam(e.target.value); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                        placeholder="Achternaam *"
                        className="sm:col-span-4 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                      />
                      <input
                        type="text"
                        value={bigSearchGeboortedatum}
                        onChange={(e) => { setBigSearchGeboortedatum(e.target.value); setBigSearchError(''); }}
                        placeholder="DD-MM-JJJJ of JJJJ-MM-DD"
                        className="sm:col-span-3 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151]"
                      />
                      <button
                        type="button"
                        disabled={bigSearchLoading || !bigSearchGeslacht || bigSearchAchternaam.trim().length < 2}
                        onClick={async () => {
                          setBigSearchError('');
                          setBigSearchResults([]);
                          setBigSearchPendingSelection(null);
                          const raw = bigSearchGeboortedatum.trim();
                          let birthDate: string | undefined;
                          if (raw) {
                            const ddmmyyyy = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
                            if (ddmmyyyy) {
                              birthDate = `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, '0')}-${ddmmyyyy[1].padStart(2, '0')}`;
                            } else if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
                              birthDate = raw;
                            } else {
                              setBigSearchError('Geboortedatum: gebruik DD-MM-JJJJ of JJJJ-MM-DD');
                              return;
                            }
                          }
                          setBigSearchLoading(true);
                          const res = await searchBigByName(bigSearchAchternaam.trim(), {
                            gender: bigSearchGeslacht as BigSearchGender,
                            birthDate,
                            initials: bigSearchVoorletters.trim() || undefined,
                          });
                          setBigSearchLoading(false);
                          if (res.error) setBigSearchError(res.error);
                          else setBigSearchResults(res.resultaten ?? []);
                        }}
                        className="sm:col-span-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4FA151] text-white rounded-xl font-medium text-sm hover:bg-[#3E8E45] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bigSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Zoeken
                      </button>
                    </div>
                    {bigSearchError && (
                      <div className="mb-2">
                        <p className="text-sm text-red-600">{bigSearchError}</p>
                        <a
                          href="https://www.bigregister.nl/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#4FA151] hover:underline mt-1 inline-block"
                        >
                          Zoek je BIG-nummer op bigregister.nl →
                        </a>
                      </div>
                    )}
                    {bigSearchResults.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs text-gray-600 mb-1">Klik op je naam om je BIG-nummer in te vullen:</p>
                        {!bigSearchGeboortedatum.trim() && (
                          <p className="text-xs text-amber-600 mb-1">Tip: vul geboortedatum in voor minder resultaten.</p>
                        )}
                        {bigSearchPendingSelection ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-[#0F172A] mb-2">Klopt dit? Controleer of dit jouw gegevens zijn.</p>
                            <p className="text-sm text-gray-700 mb-2">{bigSearchPendingSelection.name || 'Onbekende naam'} — BIG {bigSearchPendingSelection.big_number}</p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setBigNumber(bigSearchPendingSelection.big_number);
                                  setBigSearchResults([]);
                                  setBigSearchPendingSelection(null);
                                  setError('');
                                }}
                                className="px-3 py-1.5 bg-[#4FA151] text-white text-sm font-medium rounded-lg hover:bg-[#3E8E45]"
                              >
                                Ja, bevestigen
                              </button>
                              <button
                                type="button"
                                onClick={() => setBigSearchPendingSelection(null)}
                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                              >
                                Nee, andere kiezen
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-48 overflow-y-auto space-y-1.5">
                            {bigSearchResults.map((item) => (
                              <button
                                key={item.big_number}
                                type="button"
                                onClick={() => setBigSearchPendingSelection(item)}
                                className="w-full text-left px-3 py-2.5 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-[#4FA151] transition text-sm"
                              >
                                <span className="font-medium text-[#0F172A]">{item.name || 'Onbekende naam'}</span>
                                <span className="text-gray-500 ml-2">BIG {item.big_number}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="bigNumber" className="block text-sm font-medium text-gray-700 mb-2">BIG-nummer *</label>
                    <input
                      id="bigNumber"
                      type="text"
                      inputMode="numeric"
                      value={bigNumber}
                      onChange={(e) => setBigNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                      placeholder="11 cijfers (of kies hierboven uit zoekresultaat)"
                    />
                  </div>
                </>
              )}
              {profession === 'pob' && (
                <p className="text-gray-600 text-base mb-4">Je hebt gekozen voor Praktijkondersteuner bedrijfsarts (POB). Klik op Registratie voltooien.</p>
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
                disabled={loading || (profession && NEEDS_BIG.includes(profession) && bigNumber.replace(/\D/g, '').length !== 11)}
                onClick={saveProfessionalAndComplete}
                className="w-full bg-[#4FA151] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[#3E8E45] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Bezig...</span> : 'Registratie voltooien'}
              </button>
            </>
          )}
        </div>
      )}

      {isOpdrachtgever && !profile?.onboarding_completed && (
        <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-lg shadow-emerald-900/5 border border-emerald-100/80 p-6 md:p-10">
          <button type="button" onClick={handleBackToRoleChoice} disabled={backToRoleLoading} className="text-[#4FA151] hover:underline font-medium mb-6 md:mb-8 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base">
            {backToRoleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}← Terug naar rolkeuze
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">Registreer je bedrijf</h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8">Zoek je bedrijf op naam of KvK-nummer. Na het kiezen worden de gegevens automatisch ingevuld en opgeslagen.</p>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="mb-6">
            <label htmlFor="companySearch" className="block text-sm font-medium text-gray-700 mb-2">Zoek bedrijf op naam of KvK-nummer</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="companySearch"
                  type="text"
                  value={companySearchQuery}
                  onChange={(e) => { setCompanySearchQuery(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchKvk())}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                  placeholder="Bedrijf"
                />
              </div>
              <button
                type="button"
                disabled={!companySearchQuery.trim() || kvkLoading}
                onClick={searchKvk}
                className="px-4 py-3 bg-[#4FA151] text-white rounded-xl font-medium hover:bg-[#3E8E45] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {kvkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {kvkSearchResults.length > 0 && (
            <div className="mb-6 max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-gray-200 bg-gray-50/50 p-2">
              <p className="text-xs font-medium text-gray-500 mb-2 px-2">Klik op je bedrijf om gegevens in te vullen</p>
              {kvkSearchResults.map((item) => (
                <button
                  key={`${item.kvkNummer ?? ''}-${item.vestigingsnummer ?? ''}-${item.naam ?? ''}`}
                  type="button"
                  onClick={() => applyKvkResult(item)}
                  className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-[#4FA151] transition text-sm"
                >
                  <span className="font-medium text-[#0F172A]">{item.naam || 'Onbekend'}</span>
                  {item.kvkNummer && <span className="text-gray-500 ml-2">KvK {item.kvkNummer}</span>}
                  {item.plaats && <span className="text-gray-400 ml-2">• {item.plaats}</span>}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-4 mb-8">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Bedrijfsnaam *</label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => { setCompanyName(e.target.value); setError(''); }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Kies een bedrijf uit de zoekresultaten of vul handmatig in"
              />
            </div>
            <div>
              <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">Adres (facturatie)</label>
              <input
                id="billingAddress"
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Wordt ingevuld na keuze uit zoekresultaat"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Optioneel"
              />
            </div>
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">Sector (SBI)</label>
              <input
                id="sector"
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Optioneel"
              />
            </div>
            {(vestigingsnummer || kvkType || kvkActief || rechtsvorm || statutaireNaam) && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Extra KvK-gegevens</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  {vestigingsnummer && <span>Vestigingsnr: {vestigingsnummer}</span>}
                  {kvkType && <span>Type: {kvkType}</span>}
                  {kvkActief && <span>Actief: {kvkActief}</span>}
                  {rechtsvorm && <span>Rechtsvorm: {rechtsvorm}</span>}
                  {statutaireNaam && <span className="sm:col-span-2">Statutair: {statutaireNaam}</span>}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={opdrachtgeverSaving || !companyName.trim() || kvk.replace(/\D/g, '').length !== 8}
            onClick={saveOpdrachtgeverAndComplete}
            className="w-full bg-[#4FA151] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[#3E8E45] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {opdrachtgeverSaving ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Bezig...</span> : 'Registratie voltooien'}
          </button>
        </div>
      )}

    </div>
  );
}
