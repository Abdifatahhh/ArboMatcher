import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { AlertCircle, Loader2, Briefcase, Stethoscope, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import type { ProfessionValue, OrganisationType, EmploymentType } from '../lib/types';
import { searchBigByName } from '../services/bigCheckService';
import type { BigSearchResultItem, BigSearchGender } from '../services/bigCheckService';

export type OnboardingRole = 'professional' | 'organisatie';

const ROLE_OPTIONS: { value: OnboardingRole; label: string; sub: string; icon: typeof Briefcase }[] = [
  { value: 'professional', label: 'Professional', sub: 'Vind opdrachten als professional', icon: Stethoscope },
  { value: 'organisatie', label: 'Organisatie', sub: 'Plaats opdrachten', icon: Briefcase },
];

const ORGANISATION_TYPE_OPTIONS: { value: OrganisationType; label: string }[] = [
  { value: 'ARBODIENST', label: 'Arbodienst' },
  { value: 'BEDRIJF', label: 'Bedrijf' },
  { value: 'INTERMEDIAIR', label: 'Intermediair' },
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

function OnboardingHeader({
  profile,
  user,
  onSignOut,
}: { profile: { full_name?: string | null; email?: string | null } | null; user: { email?: string } | null; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);
  const displayName = profile?.full_name?.trim() || user?.email || 'Account';
  return (
    <header className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
      <Link to="/" className="flex items-center shrink-0" aria-label="ArboMatcher">
        <LogoText theme="light" className="text-xl md:text-2xl" />
      </Link>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#0F172A]/10 hover:bg-[#0F172A]/5 transition text-[#0F172A]"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <User className="w-5 h-5 text-slate-700" />
          <span className="max-w-[140px] truncate text-sm font-medium hidden sm:inline">{displayName}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="font-semibold text-[#0F172A] truncate">{displayName}</p>
              {user?.email && <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>}
            </div>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0F172A] hover:bg-slate-50"
            >
              Contact
            </Link>
            <button
              type="button"
              onClick={() => { setOpen(false); onSignOut(); }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function Onboarding() {
  const { profile, user, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [professionStep, setProfessionStep] = useState(2);
  const [profession, setProfession] = useState<ProfessionValue | null>(null);
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(null);
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
    else if (role === 'ORGANISATIE') navigate('/organisatie/dashboard', { replace: true });
    else navigate('/', { replace: true });
  };

  if (profile?.role === 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (profile?.onboarding_completed === true) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
        <p className="text-slate-500">Doorsturen...</p>
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
  const [organisatieSaving, setOrganisatieSaving] = useState(false);
  const [organisationType, setOrganisationType] = useState<OrganisationType | null>(null);
  const [kvkLoading, setKvkLoading] = useState(false);
  const [kvkSearchMessage, setKvkSearchMessage] = useState<'idle' | 'no_results' | 'api_error'>('idle');
  const [kvkSearchErrorDetail, setKvkSearchErrorDetail] = useState('');
  const [kvkConfirmPending, setKvkConfirmPending] = useState<KvkSearchItem | null>(null);
  const kvkRequestIdRef = useRef(0);

  const handleRoleChoose = async (role: OnboardingRole) => {
    if (!user?.id || roleChoosing) return;
    setError('');
    setRoleChoosing(true);
    if (role === 'organisatie') {
      const { error: upErr } = await supabase.from('profiles').update({ role: 'ORGANISATIE' }).eq('id', user.id);
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
        plan: 'GRATIS',
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
    setEmploymentType(null);
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
    setOrganisationType(null);
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

  const kvkSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runKvkRequest = async (trimmed: string, isRetry: boolean, requestId: number): Promise<boolean> => {
    const body = trimmed.replace(/\D/g, '').length === 8 ? { kvkNummer: trimmed.replace(/\D/g, '') } : { q: trimmed };
    const { data, error: fnError } = await supabase.functions.invoke('kvk-search', { body });
    if (requestId !== kvkRequestIdRef.current) return true;
    const payload = data as { resultaten?: KvkSearchItem[]; error?: string } | null;
    if (fnError || payload?.error) {
      if (!isRetry) return false;
      const raw = payload?.error?.trim() || (typeof fnError?.message === 'string' ? fnError.message : '');
      const detail = /non-2xx|failed|fetch/i.test(raw) ? 'Zoekfunctie tijdelijk niet bereikbaar. Probeer het later opnieuw.' : (raw || 'Zoekfunctie niet bereikbaar.');
      const isNoResult = /geen resultaat|geen bedrijven/i.test(detail);
      if (isNoResult) {
        setKvkSearchResults([]);
        setKvkSearchMessage('no_results');
      } else {
        setKvkSearchErrorDetail(import.meta.env.DEV && raw ? `${detail} — ${raw}` : detail);
        setKvkSearchMessage('api_error');
        setKvkSearchResults([]);
      }
      return true;
    }
    const resultaten = payload?.resultaten ?? [];
    const seenKvk = new Set<string>();
    const uniek = resultaten.filter((r) => {
      const key = (r.kvkNummer ?? '').trim() || (r.naam ?? '').trim();
      if (!key || seenKvk.has(key)) return false;
      seenKvk.add(key);
      return true;
    });
    setKvkSearchResults(uniek);
    setKvkSearchMessage(uniek.length === 0 ? 'no_results' : 'idle');
    return true;
  };

  const searchKvk = async (queryOverride?: string) => {
    const trimmed = (queryOverride !== undefined ? queryOverride : companySearchQuery).trim();
    if (trimmed.length < 3) return;
    setKvkSearchMessage('idle');
    setKvkSearchErrorDetail('');
    setKvkSearchResults([]);
    setKvkLoading(true);
    const requestId = ++kvkRequestIdRef.current;
    try {
      let done = await runKvkRequest(trimmed, false, requestId);
      if (requestId !== kvkRequestIdRef.current) return;
      if (!done) {
        done = await runKvkRequest(trimmed, true, requestId);
        if (requestId !== kvkRequestIdRef.current) return;
        if (!done) setKvkSearchErrorDetail('De zoekfunctie reageerde niet. Probeer het later opnieuw.');
      }
    } catch (err) {
      if (kvkRequestIdRef.current !== requestId) return;
      setKvkSearchErrorDetail(err instanceof Error ? err.message : 'Zoekfunctie niet bereikbaar.');
      setKvkSearchMessage('api_error');
      setKvkSearchResults([]);
    } finally {
      if (kvkRequestIdRef.current === requestId) setKvkLoading(false);
    }
  };

  useEffect(() => {
    const trimmed = companySearchQuery.trim();
    if (trimmed.length < 3) {
      kvkRequestIdRef.current += 1;
      setKvkSearchResults([]);
      setKvkSearchMessage('idle');
      setKvkSearchErrorDetail('');
      if (kvkSearchDebounceRef.current) {
        clearTimeout(kvkSearchDebounceRef.current);
        kvkSearchDebounceRef.current = null;
      }
      return;
    }
    if (kvkSearchDebounceRef.current) clearTimeout(kvkSearchDebounceRef.current);
    kvkSearchDebounceRef.current = setTimeout(() => {
      kvkSearchDebounceRef.current = null;
      searchKvk(trimmed);
    }, 400);
    return () => {
      if (kvkSearchDebounceRef.current) clearTimeout(kvkSearchDebounceRef.current);
    };
  }, [companySearchQuery]);

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
    setKvkSearchMessage('idle');
    setKvkSearchErrorDetail('');
    setCompanySearchQuery('');
    setKvkConfirmPending(null);
  };

  const saveOrganisatieAndComplete = async () => {
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
    setOrganisatieSaving(true);
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
      organization_type: organisationType ?? null,
    };
    if (existing) {
      const { error: upErr } = await supabase.from('employers').update(employerPayload).eq('id', existing.id);
      if (upErr) {
        setError(upErr.message);
        setOrganisatieSaving(false);
        return;
      }
    } else {
      const { error: inErr } = await supabase.from('employers').insert({
        user_id: user.id,
        ...employerPayload,
      });
      if (inErr) {
        setError(inErr.message);
        setOrganisatieSaving(false);
        return;
      }
    }
    const { error: upErr } = await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    if (upErr) {
      setError(upErr.message);
      setOrganisatieSaving(false);
      return;
    }
    await refreshProfile();
    setOrganisatieSaving(false);
    navigate('/organisatie/dashboard', { replace: true });
  };


  const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string }[] = [
    { value: 'FREELANCE_ZZP', label: 'Freelance / ZZP' },
    { value: 'LOONDIENST', label: 'In loondienst' },
  ];

  const saveProfessionalAndComplete = async () => {
    if (!user?.id) return;
    setError('');
    if (employmentType === 'FREELANCE_ZZP') {
      if (!companyName.trim() || kvk.replace(/\D/g, '').length !== 8) {
        setError('Vul bij Freelance/ZZP uw bedrijfsgegevens in (KvK-zoeken op de vorige stap).');
        return;
      }
    }
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
    const kvkDigits = employmentType === 'FREELANCE_ZZP' ? (kvk.replace(/\D/g, '') || null) : null;
    const payload: Record<string, unknown> = {
      profession: profession || undefined,
      profession_type: professionType,
      big_number: bigVal,
      rcm_number: rcmVal,
      employment_type: employmentType ?? null,
    };
    const shouldSetPending =
      !!bigVal &&
      String(bigVal).replace(/\D/g, '').length === 11 &&
      profession != null &&
      NEEDS_BIG.includes(profession);
    if (shouldSetPending) {
      payload.verification_status = 'PENDING';
    }
    if (employmentType === 'FREELANCE_ZZP' && kvkDigits && kvkDigits.length === 8) {
      payload.kvk = kvkDigits;
      payload.company_name = companyName.trim() || null;
      payload.billing_address = billingAddress.trim() || null;
      payload.website = website.trim() || null;
      payload.sector = sector.trim() || null;
      payload.vestigingsnummer = vestigingsnummer.trim() || null;
      payload.kvk_type = kvkType.trim() || null;
      payload.rechtsvorm = rechtsvorm.trim() || null;
      payload.statutaire_naam = statutaireNaam.trim() || null;
    }
    if (proRow) {
      const { error: proErr } = await supabase.from('professionals').update(payload).eq('id', proRow.id);
      if (proErr) {
        setError(proErr.message || 'Opslaan professional mislukt');
        setLoading(false);
        return;
      }
    } else {
      const { error: proErr } = await supabase.from('professionals').insert({
        user_id: user.id,
        ...payload,
        verification_status: (payload.verification_status as string) ?? 'UNVERIFIED',
        plan: 'GRATIS',
        specialties: [],
        regions: [],
      });
      if (proErr) {
        setError(proErr.message || 'Aanmaken professional mislukt');
        setLoading(false);
        return;
      }
    }
    const { error: upErr } = await supabase.from('profiles').update({ onboarding_completed: true, role: 'professional' }).eq('id', user.id);
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }


  const role = profile?.role;
  const isProfessional = role === 'professional';
  const isOrganisatie = role === 'ORGANISATIE';

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  if (showRoleStep) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <OnboardingHeader profile={profile} user={user} onSignOut={handleSignOut} />
        <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-10 md:pt-6 md:pb-16 px-4 md:px-6">
          <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-0.5 text-center">Welkom, voltooi onderstaande stappen</h1>
          <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6 text-center max-w-xl">Voordat u ArboMatcher kunt gebruiken, kiest u uw rol: professional (opdrachten zoeken) of organisatie (opdrachten plaatsen).</p>
          <div className="w-full max-w-xl bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-1 px-1">Hoe wilt u ArboMatcher gebruiken?</h1>
          <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6 px-1">Kies uw rol om verder te gaan.</p>
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={roleChoosing}
                  onClick={() => handleRoleChoose(opt.value)}
                  className="group p-5 md:p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center disabled:opacity-50 min-h-[140px] md:min-h-[160px] justify-center"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100 flex items-center justify-center mb-3 md:mb-4 transition-colors">
                    <Icon className="w-7 h-7 md:w-9 md:h-9 text-slate-700" strokeWidth={2} />
                  </div>
                  <span className="font-bold text-[#0F172A] text-sm md:text-base">{opt.label}</span>
                  <span className="text-xs md:text-sm text-slate-500 mt-1 leading-snug">{opt.sub}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
            Alle medische professionals worden gecontroleerd via het BIG-register.
          </p>
          </div>
          <p className="mt-6 text-center text-sm text-slate-400">Komt u er niet uit? <Link to="/contact" className="text-[#0F172A] hover:underline">Neem contact op</Link> met onze klantenservice.</p>
        </div>
      </div>
    );
  }

  if (!profile || (!isProfessional && !isOrganisatie)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <p className="text-slate-500">Geen onboarding beschikbaar voor dit account.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-[#0F172A] hover:underline">Naar start</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader profile={profile} user={user} onSignOut={handleSignOut} />
      <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-10 md:pt-6 md:pb-16 px-4 md:px-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-0.5 text-center">Welkom, voltooi onderstaande stappen</h1>
        <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6 text-center max-w-xl">Voordat u ArboMatcher kunt gebruiken, vult u de stappen hieronder in.</p>

      {isProfessional && (
        <div className="w-full max-w-xl bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-8">
          {professionStep === 2 && (
            <>
              <button type="button" onClick={handleBackToRoleChoice} disabled={backToRoleLoading} className="text-slate-500 hover:text-[#0F172A] font-medium mb-4 md:mb-6 flex items-center gap-2 disabled:opacity-50 text-sm transition">
                {backToRoleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}← Terug naar rolkeuze
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-1">Kies uw beroep</h1>
              <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6">Selecteer het beroep dat bij u past.</p>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="space-y-2 md:space-y-3 mb-6">
                {PROFESSION_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => { setProfession(p.value); setError(''); setProfessionStep(3); }}
                    className={`w-full flex items-center gap-3 p-4 md:p-5 rounded-xl border transition-all duration-200 text-left ${
                      profession === p.value
                        ? 'border-emerald-500 bg-white shadow-md ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      profession === p.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'
                    }`}>
                      {profession === p.value && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
                    </div>
                    <span className="font-semibold text-[#0F172A] text-sm md:text-base">{p.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {professionStep === 3 && (
            <>
              <button type="button" onClick={() => setProfessionStep(2)} className="text-slate-500 hover:text-[#0F172A] font-medium mb-4 md:mb-6 text-sm transition">
                ← Terug naar beroep
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-1">Hoe werkt u?</h1>
              <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6">Kies of u als freelancer/ZZP werkt of in loondienst.</p>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="space-y-2 md:space-y-3 mb-6">
                {EMPLOYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setError('');
                      setEmploymentType(opt.value);
                      if (opt.value === 'LOONDIENST') setProfessionStep(5);
                      else setProfessionStep(4);
                    }}
                    className="w-full flex items-center gap-3 p-4 md:p-5 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 text-left hover:border-slate-300 hover:shadow-md"
                  >
                    <span className="font-semibold text-[#0F172A] text-sm md:text-base">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {professionStep === 4 && (
            <>
              <button type="button" onClick={() => { setProfessionStep(3); setCompanyName(''); setKvk(''); setBillingAddress(''); setKvkSearchResults([]); setKvkConfirmPending(null); setCompanySearchQuery(''); }} className="text-slate-500 hover:text-[#0F172A] font-medium mb-4 md:mb-6 text-sm transition">
                ← Terug naar hoe werkt u
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-1">Je bedrijf (ZZP)</h1>
              <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6">Zoek uw eenmanszaak of bedrijf op naam of KvK-nummer en bevestig dat dit uw bedrijf is.</p>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              {kvkConfirmPending && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="font-semibold text-[#0F172A] mb-2">Weet u zeker dat dit uw bedrijf is?</p>
                  <p className="text-sm text-slate-600 mb-4">
                    <strong>{kvkConfirmPending.naam || 'Onbekend'}</strong>
                    {kvkConfirmPending.kvkNummer && <> (KvK {kvkConfirmPending.kvkNummer})</>}
                    {kvkConfirmPending.plaats && <> · {kvkConfirmPending.plaats}</>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => { applyKvkResult(kvkConfirmPending); setKvkConfirmPending(null); }} className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20">Ja, dit is mijn bedrijf</button>
                    <button type="button" onClick={() => setKvkConfirmPending(null)} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition">Nee, ander bedrijf kiezen</button>
                  </div>
                </div>
              )}
              {!kvkConfirmPending && (
                <>
                  <div className="mb-6">
                    <label htmlFor="proCompanySearch" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Zoek bedrijf op naam of KvK-nummer</label>
                    <div className="relative">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          <input
                            id="proCompanySearch"
                            type="text"
                            value={companySearchQuery}
                            onChange={(e) => {
                              const v = e.target.value;
                              setCompanySearchQuery(v);
                              setError('');
                              kvkRequestIdRef.current += 1;
                              setKvkSearchMessage('idle');
                              setKvkSearchErrorDetail('');
                              if (v.trim().length < 3) setKvkSearchResults([]);
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), companySearchQuery.trim().length >= 3 && searchKvk())}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] shadow-sm"
                            placeholder="Bedrijf (min. 3 tekens)"
                          />
                        </div>
                      <button type="button" disabled={companySearchQuery.trim().length < 3 || kvkLoading} onClick={() => searchKvk()} className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-500 whitespace-nowrap shadow-lg shadow-emerald-500/20">
                          <Search className="w-5 h-5" />
                        </button>
                      </div>
                      {kvkSearchResults.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg p-2 space-y-1">
                          <p className="text-xs font-medium text-slate-400 px-2 py-1">Klik op uw bedrijf</p>
                          {kvkSearchResults.map((item) => (
                            <button
                              key={`${item.kvkNummer ?? ''}-${item.vestigingsnummer ?? ''}-${item.naam ?? ''}`}
                              type="button"
                              onClick={() => setKvkConfirmPending(item)}
                              className="w-full text-left px-4 py-3 rounded-lg border border-transparent hover:bg-slate-50 hover:border-[#0F172A] transition text-sm"
                            >
                              <span className="font-semibold text-[#0F172A]">{item.naam || 'Onbekend'}</span>
                              {item.kvkNummer && <span className="text-slate-500 ml-2">KvK {item.kvkNummer}</span>}
                              {item.plaats && <span className="text-slate-400 ml-2">• {item.plaats}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {kvkSearchMessage === 'api_error' && <p className="mt-2 text-sm text-red-600">{kvkSearchErrorDetail || 'De zoekfunctie is tijdelijk niet beschikbaar. Probeer het later opnieuw.'}</p>}
                  </div>
                  {companyName && kvk.replace(/\D/g, '').length === 8 && (
                    <p className="mb-6 text-sm text-slate-500">Gekozen: <strong className="text-[#0F172A]">{companyName}</strong> (KvK {kvk}).</p>
                  )}
                </>
              )}
              {companyName && kvk.replace(/\D/g, '').length === 8 && !kvkConfirmPending && (
                <button type="button" onClick={() => setProfessionStep(5)} className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-4 rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20">
                  Volgende
                </button>
              )}
            </>
          )}

          {professionStep === 5 && (
            <>
              <button type="button" onClick={() => setProfessionStep(employmentType === 'FREELANCE_ZZP' ? 4 : 3)} className="text-slate-500 hover:text-[#0F172A] font-medium mb-4 md:mb-6 text-sm transition">
                ← Terug
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-1">Validatie</h1>
              {profession && NEEDS_BIG.includes(profession) && (
                <>
                  <p className="text-slate-500 text-sm mb-3">Vul uw BIG-nummer in of zoek het op met uw achternaam.</p>
                  <div className="mb-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Zoek uw BIG-nummer op (zoals op bigregister.nl)</p>
                    <div className="flex flex-wrap gap-6 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Geslacht *</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="bigSearchGeslacht"
                              checked={bigSearchGeslacht === 'Man'}
                              onChange={() => { setBigSearchGeslacht('Man'); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                              className="text-[#0F172A] focus:ring-slate-900"
                            />
                            <span className="text-sm text-slate-700">Man</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="bigSearchGeslacht"
                              checked={bigSearchGeslacht === 'Vrouw'}
                              onChange={() => { setBigSearchGeslacht('Vrouw'); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                              className="text-[#0F172A] focus:ring-slate-900"
                            />
                            <span className="text-sm text-slate-700">Vrouw</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-3">
                      <div className="sm:col-span-2">
                        <label htmlFor="bigSearchVoorletters" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Voorletters</label>
                        <input
                          id="bigSearchVoorletters"
                          type="text"
                          value={bigSearchVoorletters}
                          onChange={(e) => { setBigSearchVoorletters(e.target.value.toUpperCase().slice(0, 10)); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                          placeholder="bijv. A.B."
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label htmlFor="bigSearchAchternaam" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Achternaam *</label>
                        <input
                          id="bigSearchAchternaam"
                          type="text"
                          value={bigSearchAchternaam}
                          onChange={(e) => { setBigSearchAchternaam(e.target.value); setBigSearchError(''); setBigSearchResults([]); setBigSearchPendingSelection(null); }}
                          placeholder="bijv. Jansen"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label htmlFor="bigSearchGeboortedatum" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Geboortedatum</label>
                        <input
                          id="bigSearchGeboortedatum"
                          type="text"
                          value={bigSearchGeboortedatum}
                          onChange={(e) => { setBigSearchGeboortedatum(e.target.value); setBigSearchError(''); }}
                          placeholder="DD-MM-JJJJ"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition"
                        />
                      </div>
                      <div className="sm:col-span-3 flex items-end">
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
                              setBigSearchError('Geboortedatum: gebruik DD-MM-JJJJ');
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
                        className="sm:col-span-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-medium text-sm hover:from-emerald-600 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                      >
                        {bigSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Zoeken
                      </button>
                      </div>
                    </div>
                    {bigSearchError && (
                      <div className="mb-2">
                        <p className="text-sm text-red-600">{bigSearchError}</p>
                        <a
                          href="https://www.bigregister.nl/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0F172A] hover:underline mt-1 inline-block"
                        >
                          Zoek uw BIG-nummer op bigregister.nl →
                        </a>
                      </div>
                    )}
                    {bigSearchResults.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs text-slate-500 mb-1">Klik op uw naam om uw BIG-nummer in te vullen:</p>
                        {!bigSearchGeboortedatum.trim() && (
                          <p className="text-xs text-amber-600 mb-1">Tip: vul geboortedatum in voor minder resultaten.</p>
                        )}
                        {bigSearchPendingSelection ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-[#0F172A] mb-2">Klopt dit? Controleer of dit uw gegevens zijn.</p>
                            <p className="text-sm text-slate-600 mb-2">{bigSearchPendingSelection.name || 'Onbekende naam'} — BIG {bigSearchPendingSelection.big_number}</p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setBigNumber(bigSearchPendingSelection.big_number);
                                  setBigSearchResults([]);
                                  setBigSearchPendingSelection(null);
                                  setError('');
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-green-500"
                              >
                                Ja, bevestigen
                              </button>
                              <button
                                type="button"
                                onClick={() => setBigSearchPendingSelection(null)}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
                              >
                                Nee, andere kiezen
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-72 overflow-y-auto space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            {bigSearchResults.map((item) => (
                              <button
                                key={item.big_number}
                                type="button"
                                onClick={() => setBigSearchPendingSelection(item)}
                                className="w-full text-left px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 hover:shadow-md transition text-sm"
                              >
                                <span className="font-semibold text-[#0F172A]">{item.name || 'Onbekende naam'}</span>
                                <span className="text-slate-500 ml-2">BIG {item.big_number}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <label htmlFor="bigNumber" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">BIG-nummer *</label>
                    <input
                      id="bigNumber"
                      type="text"
                      inputMode="numeric"
                      value={bigNumber}
                      onChange={(e) => setBigNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
                      placeholder="11 cijfers (of kies hierboven uit zoekresultaat)"
                    />
                  </div>
                </>
              )}
              {profession === 'pob' && (
                <p className="text-slate-500 text-sm mb-4">Je hebt gekozen voor Praktijkondersteuner bedrijfsarts (POB). Klik op Registratie voltooien.</p>
              )}
              {profession === 'casemanager_verzuim' && (
                <>
                  <p className="text-slate-500 text-sm mb-4">Optioneel: vul uw RCM-nummer in.</p>
                  <div className="mb-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <label htmlFor="rcmNumber" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">RCM-nummer (optioneel)</label>
                    <input
                      id="rcmNumber"
                      type="text"
                      value={rcmNumber}
                      onChange={(e) => setRcmNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] outline-none"
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
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Bezig...</span> : 'Registratie voltooien'}
              </button>
            </>
          )}
        </div>
      )}

      {isOrganisatie && !profile?.onboarding_completed && (
        <div className="w-full max-w-xl bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-8">
          <button type="button" onClick={handleBackToRoleChoice} disabled={backToRoleLoading} className="text-slate-500 hover:text-[#0F172A] font-medium mb-4 md:mb-6 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base transition">
            {backToRoleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}← Terug naar rolkeuze
          </button>
          {!organisationType ? (
            <>
              <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-1">Kies type organisatie</h1>
              <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6">Selecteer het type organisatie dat bij u past.</p>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="space-y-2 md:space-y-3 mb-6">
                {ORGANISATION_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setOrganisationType(opt.value); setError(''); }}
                    className="w-full flex items-center gap-3 p-4 md:p-5 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 text-left hover:border-slate-300 hover:shadow-md"
                  >
                    <span className="font-semibold text-[#0F172A] text-sm md:text-base">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setOrganisationType(null)} className="text-slate-500 hover:text-[#0F172A] font-medium mb-3 text-sm transition">← Terug naar type organisatie</button>
              <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-1">Registreer uw bedrijf</h1>
              <p className="text-slate-500 text-sm md:text-base mb-4 md:mb-6">Zoek uw bedrijf op naam of KvK-nummer, kies uw bedrijf en voltooi de registratie. Adres en overige gegevens kunt u later op uw dashboard invullen.</p>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="mb-6">
            <label htmlFor="companySearch" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Zoek bedrijf op naam of KvK-nummer</label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="companySearch"
                    type="text"
                    value={companySearchQuery}
                    onChange={(e) => {
                    const v = e.target.value;
                    setCompanySearchQuery(v);
                    setError('');
                    kvkRequestIdRef.current += 1;
                    setKvkSearchMessage('idle');
                    setKvkSearchErrorDetail('');
                    if (v.trim().length < 3) setKvkSearchResults([]);
                  }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), companySearchQuery.trim().length >= 3 && searchKvk())}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition text-[#0F172A] shadow-sm"
                    placeholder="Bedrijf (min. 3 tekens)"
                  />
                </div>
                <button
                  type="button"
                  disabled={companySearchQuery.trim().length < 3 || kvkLoading}
                  onClick={() => searchKvk()}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-500 whitespace-nowrap shadow-lg shadow-emerald-500/20"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              {kvkSearchResults.length > 0 && !kvkConfirmPending && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg p-2 space-y-1">
                  <p className="text-xs font-medium text-slate-400 px-2 py-1">Klik op uw bedrijf</p>
                  {kvkSearchResults.map((item) => (
                    <button
                      key={`${item.kvkNummer ?? ''}-${item.vestigingsnummer ?? ''}-${item.naam ?? ''}`}
                      type="button"
                      onClick={() => setKvkConfirmPending(item)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-transparent hover:bg-slate-50 hover:border-[#0F172A] transition text-sm"
                    >
                      <span className="font-semibold text-[#0F172A]">{item.naam || 'Onbekend'}</span>
                      {item.kvkNummer && <span className="text-slate-500 ml-2">KvK {item.kvkNummer}</span>}
                      {item.plaats && <span className="text-slate-400 ml-2">• {item.plaats}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {kvkSearchMessage === 'api_error' && <p className="mt-2 text-sm text-red-600">{kvkSearchErrorDetail || 'De zoekfunctie is tijdelijk niet beschikbaar. Probeer het later opnieuw.'}</p>}
          </div>
          {kvkConfirmPending && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="font-semibold text-[#0F172A] mb-2">Weet u zeker dat dit uw bedrijf is?</p>
              <p className="text-sm text-slate-600 mb-4">
                <strong>{kvkConfirmPending.naam || 'Onbekend'}</strong>
                {kvkConfirmPending.kvkNummer && <> (KvK {kvkConfirmPending.kvkNummer})</>}
                {kvkConfirmPending.plaats && <> · {kvkConfirmPending.plaats}</>}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => { applyKvkResult(kvkConfirmPending); setKvkConfirmPending(null); }}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
                >
                  Ja, dit is mijn bedrijf
                </button>
                <button
                  type="button"
                  onClick={() => setKvkConfirmPending(null)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition"
                >
                  Nee, ander bedrijf kiezen
                </button>
              </div>
            </div>
          )}
          {companyName && kvk.replace(/\D/g, '').length === 8 && (
            <p className="mb-6 text-sm text-slate-500">
              Gekozen: <strong>{companyName}</strong> (KvK {kvk}). U kunt adres en overige gegevens later op uw dashboard invullen.
            </p>
          )}
          <button
            type="button"
            disabled={organisatieSaving || !companyName.trim() || kvk.replace(/\D/g, '').length !== 8}
            onClick={saveOrganisatieAndComplete}
className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {organisatieSaving ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Bezig...</span> : 'Registratie voltooien'}
          </button>
            </>
          )}
        </div>
      )}

        <p className="mt-8 text-center text-sm text-slate-400">Komt u er niet uit? <Link to="/contact" className="text-[#0F172A] hover:underline">Neem contact op</Link> met onze klantenservice.</p>
      </div>
    </div>
  );
}
