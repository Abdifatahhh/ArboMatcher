import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginPath } from '../config/portal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { AlertCircle, Loader2 } from 'lucide-react';
import { LogoText } from '../components/ui/Logo';
import { PrivacyConsent, CONSENT_KEYS } from '../components/PrivacyConsent';
import type { ConsentPreferences } from '../lib/types';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [consentToggles, setConsentToggles] = useState<boolean[]>(CONSENT_KEYS.map(() => false));
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [, setCooldownTick] = useState(0);
  const submittingRef = useRef(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const COOLDOWN_SECONDS = 60;
  const cooldownSecondsLeft = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)) : 0;
  const isOnCooldown = cooldownSecondsLeft > 0;

  useEffect(() => {
    if (!cooldownUntil) return;
    const id = setInterval(() => {
      const left = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (left <= 0) {
        setCooldownUntil(null);
        clearInterval(id);
        return;
      }
      setCooldownTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const checkEmailAvailable = async (emailToCheck: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_email_available', { check_email: emailToCheck.trim().toLowerCase() });
      return !error && data === true;
    } catch {
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isOnCooldown) {
      setError(`Wacht nog ${cooldownSecondsLeft} seconden voordat u opnieuw kunt proberen.`);
      return;
    }
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
    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim) {
      setError('Vul een geldig e-mailadres in');
      return;
    }
    if (!(await checkEmailAvailable(emailTrim))) {
      setError('Dit e-mailadres is al in gebruik. Log in of gebruik wachtwoord vergeten.');
      return;
    }
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || undefined;
    const consent_preferences: ConsentPreferences = {
      main: acceptPrivacy,
      inform_candidate: consentToggles[0] ?? false,
      share_profile_cv: consentToggles[1] ?? false,
      products_services: consentToggles[2] ?? false,
      share_sister_companies: consentToggles[3] ?? false,
      newsletter: consentToggles[4] ?? false,
      feedback_reviews: consentToggles[5] ?? false,
      relevant_content: consentToggles[6] ?? false,
    };

    const { error: signUpError, hasSession } = await signUp(emailTrim, password, 'onboarding', {
      first_name: firstName.trim() || undefined,
      last_name: lastName.trim() || undefined,
      full_name: fullName,
      phone: phone.trim() || undefined,
      consent_preferences,
    });

    if (signUpError) {
      if (signUpError.category === 'too_many_requests') {
        setCooldownUntil(Date.now() + COOLDOWN_SECONDS * 1000);
        setError('De aanmeldservice heeft even een limiet bereikt. U kunt over een minuut opnieuw proberen.');
      } else {
        setError(signUpError.userMessage);
      }
      setLoading(false);
      submittingRef.current = false;
      return;
    }
    setLoading(false);
    submittingRef.current = false;
    navigate('/registratie-gelukt', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white flex flex-col items-center pt-8 pb-8 md:pt-24 md:pb-12 px-3 md:px-4">
      <div className="mb-10">
        <LogoText theme="light" className="text-2xl" />
      </div>

      <div className="w-full max-w-xl bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Account aanmaken</h1>

        {(error || isOnCooldown) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p>{error || (isOnCooldown ? `Te veel pogingen. Probeer over ${cooldownSecondsLeft} seconden opnieuw.` : '')}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-500 mb-2">Voornaam</label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Voornaam"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-500 mb-2">Achternaam</label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
                placeholder="Achternaam"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">E-mailadres</label>
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-2">Telefoonnummer</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
              placeholder="Bijv. 06-12345678"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-2">Wachtwoord</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
              placeholder="Minimaal 8 karakters"
            />
            <p className="mt-1 text-xs text-gray-500">Minimaal 8 karakters.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-500 mb-2">Bevestig wachtwoord</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDF2F7] border-0 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:bg-white transition text-[#0F172A]"
              placeholder="Bevestig wachtwoord"
            />
          </div>

          <div className="space-y-4">
            <PrivacyConsent
              checked={acceptPrivacy}
              onChange={setAcceptPrivacy}
              toggles={consentToggles}
              onTogglesChange={setConsentToggles}
            />
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
              />
              <span className="text-sm text-gray-700">
                Ik ga akkoord met de <Link to="/terms" className="text-[#4FA151] hover:underline">algemene voorwaarden</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isOnCooldown}
            className="w-full bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Bezig...</span>
            ) : (
              isOnCooldown ? `Wacht ${cooldownSecondsLeft}s` : 'Account aanmaken'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Heb je al een account?{' '}
            <Link to={getLoginPath()} className="text-[#4FA151] hover:underline font-medium">Inloggen</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
