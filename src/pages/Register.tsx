import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Briefcase, Stethoscope, User, Building2, Search, Loader2, Check } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import type { UserRole } from '../lib/types';

type OpdrachtgeverType = 'opdrachtgever' | 'intermediair' | 'detacheerder';

interface KvkResult {
  kvkNummer: string;
  vestigingsnummer?: string;
  naam: string;
  straatnaam: string;
  huisnummer: string | number;
  postcode: string;
  plaats: string;
  type: string;
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [, setRole] = useState<UserRole | null>(null);
  const [userType, setUserType] = useState<'freelancer' | 'organisatie' | null>(null);
  const [opdrachtgeverType, setOpdrachtgeverType] = useState<OpdrachtgeverType>('opdrachtgever');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [kvkSearch, setKvkSearch] = useState('');
  const [kvkResults, setKvkResults] = useState<KvkResult[]>([]);
  const [kvkSearching, setKvkSearching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<KvkResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const searchKvk = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setKvkResults([]);
      return;
    }

    setKvkSearching(true);
    try {
      const isKvkNumber = /^\d+$/.test(query);
      const param = isKvkNumber ? `kvkNummer=${encodeURIComponent(query)}` : `q=${encodeURIComponent(query)}`;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kvk-search?${param}`
      );
      const data = await response.json();
      setKvkResults(data.resultaten || []);
      setShowResults(true);
    } catch {
      setKvkResults([]);
    } finally {
      setKvkSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (kvkSearch) {
        searchKvk(kvkSearch);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [kvkSearch, searchKvk]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten');
      return;
    }

    if (!acceptPrivacy || !acceptTerms) {
      setError('U moet akkoord gaan met de voorwaarden');
      return;
    }

    setStep(2);
  };

  const handleRoleCardClick = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ARTS') {
      handleFinalSubmit('ARTS');
    } else {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (selectedRole: UserRole) => {
    setLoading(true);
    setError('');

    const { error: signUpError } = await signUp(email, password, selectedRole);

    if (signUpError) {
      setError(signUpError.userMessage);
      setStep(1);
      setLoading(false);
      return;
    }

    if (selectedRole === 'ARTS') {
      navigate('/arts/profiel');
    } else if (selectedRole === 'OPDRACHTGEVER') {
      navigate('/opdrachtgever/profiel');
    }

    setLoading(false);
  };

  const handleOpdrachtgeverConfirm = () => {
    if (!userType) {
      setError('Selecteer of je freelancer bent of voor een organisatie werkt');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleCompanySelect = (company: KvkResult) => {
    setSelectedCompany(company);
    setKvkSearch(company.naam);
    setShowResults(false);
  };

  const handleCompanyConfirm = () => {
    if (!selectedCompany) {
      setError('Selecteer eerst een bedrijf uit de KVK-resultaten');
      return;
    }
    handleFinalSubmit('OPDRACHTGEVER');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center py-8 px-4">
      <div className="mb-8">
        <Link to="/">
          <LogoText theme="light" className="text-2xl" />
        </Link>
      </div>

      {step === 1 && (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Aanmelden</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-500 mb-2">
                  Voornaam
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                  placeholder="Vul hier je voornaam in"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-500 mb-2">
                  Achternaam
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                  placeholder="Vul hier je achternaam in"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="uw@email.nl"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-2">
                Telefoonnummer
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Vul hier je telefoonnummer in"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-2">
                Nieuw wachtwoord
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Minimaal 8 karakters"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimaal 8 karakters, een combinatie van hoofdletters en kleine letters, minimaal een cijfer en een speciaal karakter.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-500 mb-2">
                Bevestig wachtwoord
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Bevestig je wachtwoord"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
                />
                <span className="text-sm text-gray-700">
                  Ik ga akkoord met de verwerking van mijn persoonsgegevens voor de vermelde doeleinden.
                  <br />
                  <Link to="/privacy" className="text-[#4FA151] hover:underline">
                    Uitgebreide instellingen
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
                />
                <span className="text-sm text-gray-700">
                  Ik ga akkoord met de{' '}
                  <Link to="/terms" className="text-[#4FA151] hover:underline">
                    algemene voorwaarden
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4FA151] text-white py-3 rounded-lg font-semibold hover:bg-[#3E8E45] transition"
            >
              Doorgaan
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Heb je al een account?{' '}
              <Link to="/login" className="text-[#4FA151] hover:underline font-medium">
                Inloggen
              </Link>
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setStep(1)}
            className="text-sm text-gray-500 hover:text-[#0F172A] mb-4"
          >
            &#8592; Terug
          </button>

          <h1 className="text-2xl font-bold text-[#0F172A] text-center mb-2">Bijna klaar!</h1>
          <p className="text-gray-500 text-center mb-8">Kies uw rol om uw registratie te voltooien</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handleRoleCardClick('OPDRACHTGEVER')}
              disabled={loading}
              className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-[#4FA151] hover:shadow-md transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Briefcase className="w-12 h-12 text-[#4FA151] mb-4" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Ik ben opdrachtgever</h3>
              <p className="text-gray-600">
                Ik zoek bedrijfsartsen voor opdrachten binnen mijn organisatie of arbodienst.
              </p>
            </button>

            <button
              onClick={() => handleRoleCardClick('ARTS')}
              disabled={loading}
              className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-[#4FA151] hover:shadow-md transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Stethoscope className="w-12 h-12 text-[#4FA151] mb-4" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Ik ben arts</h3>
              <p className="text-gray-600">
                Ik ben bedrijfsarts of arbo-professional en zoek interessante opdrachten.
              </p>
            </button>
          </div>

          {loading && (
            <p className="text-center text-gray-500 mt-6">Account wordt aangemaakt...</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-[#0F172A] mb-4">Kies hoe jij ArboMatch gebruikt</h1>
          <p className="text-gray-500 mb-6">Ben je een freelancer of vertegenwoordig je een organisatie?</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('freelancer')}
              className={`relative p-6 rounded-xl border-2 transition flex flex-col items-center text-center ${
                userType === 'freelancer'
                  ? 'border-[#4FA151] bg-[#4FA151]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                userType === 'freelancer' ? 'border-[#4FA151]' : 'border-gray-300'
              }`}>
                {userType === 'freelancer' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4FA151]" />
                )}
              </div>
              <User className={`w-10 h-10 mb-3 ${userType === 'freelancer' ? 'text-[#4FA151]' : 'text-gray-400'}`} />
              <span className={`font-medium ${userType === 'freelancer' ? 'text-[#0F172A]' : 'text-gray-600'}`}>
                Ik ben freelancer
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('organisatie')}
              className={`relative p-6 rounded-xl border-2 transition flex flex-col items-center text-center ${
                userType === 'organisatie'
                  ? 'border-[#4FA151] bg-[#4FA151]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                userType === 'organisatie' ? 'border-[#4FA151]' : 'border-gray-300'
              }`}>
                {userType === 'organisatie' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4FA151]" />
                )}
              </div>
              <Building2 className={`w-10 h-10 mb-3 ${userType === 'organisatie' ? 'text-[#4FA151]' : 'text-gray-400'}`} />
              <span className={`font-medium ${userType === 'organisatie' ? 'text-[#0F172A]' : 'text-gray-600'}`}>
                Ik werk voor een organisatie
              </span>
            </button>
          </div>

          <div className="space-y-3 mb-8">
            <button
              type="button"
              onClick={() => setOpdrachtgeverType('opdrachtgever')}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition text-left ${
                opdrachtgeverType === 'opdrachtgever'
                  ? 'border-[#4FA151] bg-[#4FA151]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                opdrachtgeverType === 'opdrachtgever' ? 'border-[#4FA151]' : 'border-gray-300'
              }`}>
                {opdrachtgeverType === 'opdrachtgever' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4FA151]" />
                )}
              </div>
              <div>
                <span className="font-medium text-[#0F172A] block">Directe opdrachtgever</span>
                <span className="text-sm text-gray-500">Ik zoek een bedrijfsarts voor mijn eigen organisatie. De arts werkt direct voor mijn bedrijf.</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOpdrachtgeverType('intermediair')}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition text-left ${
                opdrachtgeverType === 'intermediair'
                  ? 'border-[#4FA151] bg-[#4FA151]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                opdrachtgeverType === 'intermediair' ? 'border-[#4FA151]' : 'border-gray-300'
              }`}>
                {opdrachtgeverType === 'intermediair' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4FA151]" />
                )}
              </div>
              <div>
                <span className="font-medium text-[#0F172A] block">Intermediair</span>
                <span className="text-sm text-gray-500">Ik plaats een opdracht namens een klant. Ik bemiddel tussen klant en bedrijfsarts.</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOpdrachtgeverType('detacheerder')}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition text-left ${
                opdrachtgeverType === 'detacheerder'
                  ? 'border-[#4FA151] bg-[#4FA151]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                opdrachtgeverType === 'detacheerder' ? 'border-[#4FA151]' : 'border-gray-300'
              }`}>
                {opdrachtgeverType === 'detacheerder' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4FA151]" />
                )}
              </div>
              <div>
                <span className="font-medium text-[#0F172A] block">Detacheerder</span>
                <span className="text-sm text-gray-500">Ik heb artsen in dienst. Ik detacheer mijn artsen bij opdrachtgevers.</span>
              </div>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-[#0F172A] hover:bg-gray-50 transition"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleOpdrachtgeverConfirm}
              disabled={loading}
              className="flex-1 bg-[#4FA151] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Bezig...' : 'Bevestigen'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-[#0F172A] font-semibold">
              2
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">Registreer je bedrijf</h1>
              <p className="text-gray-500 text-sm">Koppel je ArboMatch-account aan jouw KvK-geregistreerde onderneming.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="relative mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Zoek op bedrijfsnaam of KVK-nummer
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={kvkSearch}
                onChange={(e) => {
                  setKvkSearch(e.target.value);
                  setSelectedCompany(null);
                }}
                onFocus={() => kvkResults.length > 0 && setShowResults(true)}
                className="w-full pl-12 pr-12 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Bijv. ArboMatch of 12345678"
              />
              {kvkSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
              )}
            </div>

            {showResults && kvkResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {kvkResults.map((result) => (
                  <button
                    key={`${result.kvkNummer}-${result.vestigingsnummer || 'main'}`}
                    type="button"
                    onClick={() => handleCompanySelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-[#0F172A]">{result.naam}</div>
                    <div className="text-sm text-gray-500">
                      KVK: {result.kvkNummer}
                      {result.plaats && ` | ${result.plaats}`}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showResults && kvkSearch.length >= 2 && kvkResults.length === 0 && !kvkSearching && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                Geen resultaten gevonden
              </div>
            )}
          </div>

          {selectedCompany && (
            <div className="mb-6 p-4 bg-[#4FA151]/5 border-2 border-[#4FA151] rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-[#0F172A]">{selectedCompany.naam}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>KVK-nummer: {selectedCompany.kvkNummer}</div>
                    {selectedCompany.straatnaam && (
                      <div>
                        {selectedCompany.straatnaam} {selectedCompany.huisnummer}
                        {selectedCompany.postcode && `, ${selectedCompany.postcode}`}
                        {selectedCompany.plaats && ` ${selectedCompany.plaats}`}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#4FA151] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-[#0F172A] hover:bg-gray-50 transition"
            >
              Terug
            </button>
            <button
              type="button"
              onClick={handleCompanyConfirm}
              disabled={loading || !selectedCompany}
              className="flex-1 bg-[#4FA151] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Bezig...' : 'Registreer je bedrijf'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
