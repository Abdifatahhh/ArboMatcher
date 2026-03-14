import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Employer, Profile } from '../../lib/types';
import { Save, AlertCircle } from 'lucide-react';

export default function OpdrachtgeverProfiel() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [employer, setEmployer] = useState<Partial<Employer>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [
      { data: profileData },
      { data: employerData },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('employers').select('*').eq('user_id', user.id).maybeSingle(),
    ]);

    if (profileData) setProfile(profileData);
    if (employerData) setEmployer(employerData);

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

      const employerPayload = {
        company_name: employer.company_name,
        kvk: employer.kvk,
        website: employer.website,
        sector: employer.sector,
        billing_address: employer.billing_address,
        billing_email: employer.billing_email,
        vestigingsnummer: employer.vestigingsnummer ?? null,
        kvk_type: employer.kvk_type ?? null,
        kvk_actief: employer.kvk_actief ?? null,
        rechtsvorm: employer.rechtsvorm ?? null,
        statutaire_naam: employer.statutaire_naam ?? null,
      };
      if (employer.id) {
        await supabase.from('employers').update(employerPayload).eq('id', employer.id);
      } else if (employer.company_name) {
        await supabase.from('employers').insert({ user_id: user.id, ...employerPayload });
      }

      await refreshProfile();
      setMessage('Profiel succesvol opgeslagen!');
      fetchData();
    } catch (error) {
      setMessage('Er is een fout opgetreden bij het opslaan');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Bedrijfsprofiel</h1>

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

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Contactpersoon</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Naam *
              </label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Telefoonnummer
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Bedrijfsgegevens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bedrijfsnaam *
              </label>
              <input
                type="text"
                value={employer.company_name || ''}
                onChange={(e) => setEmployer({ ...employer, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                KvK-nummer
              </label>
              <div className="flex flex-wrap items-start gap-4">
                <input
                  type="text"
                  value={employer.kvk || ''}
                  onChange={(e) => setEmployer({ ...employer, kvk: e.target.value })}
                  disabled={(employer.kvk || '').replace(/\D/g, '').length === 8}
                  className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                />
                {(employer.kvk || '').replace(/\D/g, '').length === 8 && (
                  <div className="text-sm text-slate-700">
                    <p>KvK-nummer wijzigen?</p>
                    <p>Neem <Link to="/contact" className="text-[#0F172A] hover:underline">contact op</Link> met de klantenservice.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={employer.website || ''}
                onChange={(e) => setEmployer({ ...employer, website: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://www.voorbeeld.nl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sector
              </label>
              <input
                type="text"
                value={employer.sector || ''}
                onChange={(e) => setEmployer({ ...employer, sector: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Bijv: Arbodienst, Verzekeringen, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Factuuradres
              </label>
              <textarea
                value={employer.billing_address || ''}
                onChange={(e) => setEmployer({ ...employer, billing_address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Straat 123, 1234 AB Stad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Facturatie e-mail
              </label>
              <input
                type="email"
                value={employer.billing_email || ''}
                onChange={(e) => setEmployer({ ...employer, billing_email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="facturen@bedrijf.nl"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Extra KvK-gegevens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Vestigingsnummer</label>
                  <input
                    type="text"
                    value={employer.vestigingsnummer || ''}
                    onChange={(e) => setEmployer({ ...employer, vestigingsnummer: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Type</label>
                  <input
                    type="text"
                    value={employer.kvk_type || ''}
                    onChange={(e) => setEmployer({ ...employer, kvk_type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Rechtsvorm</label>
                  <input
                    type="text"
                    value={employer.rechtsvorm || ''}
                    onChange={(e) => setEmployer({ ...employer, rechtsvorm: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Statutaire naam</label>
                  <input
                    type="text"
                    value={employer.statutaire_naam || ''}
                    onChange={(e) => setEmployer({ ...employer, statutaire_naam: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              {employer.kvk_actief != null && (
                <div className="mt-3">
                  <label className="block text-xs text-slate-500 mb-1">Actief (KvK)</label>
                  <p className="text-sm text-slate-700">{employer.kvk_actief ? 'Ja' : 'Nee'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50 shadow-lg shadow-emerald-500/20"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Bezig met opslaan...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}
