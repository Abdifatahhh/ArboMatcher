import { useState, useEffect } from 'react';
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

      if (employer.id) {
        await supabase
          .from('employers')
          .update({
            company_name: employer.company_name,
            kvk: employer.kvk,
            website: employer.website,
            sector: employer.sector,
            billing_address: employer.billing_address,
            billing_email: employer.billing_email
          })
          .eq('id', employer.id);
      } else if (employer.company_name) {
        await supabase
          .from('employers')
          .insert({
            user_id: user.id,
            company_name: employer.company_name,
            kvk: employer.kvk,
            website: employer.website,
            sector: employer.sector,
            billing_address: employer.billing_address,
            billing_email: employer.billing_email
          });
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naam *
              </label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefoonnummer
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Bedrijfsgegevens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrijfsnaam *
              </label>
              <input
                type="text"
                value={employer.company_name || ''}
                onChange={(e) => setEmployer({ ...employer, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KvK-nummer
              </label>
              <input
                type="text"
                value={employer.kvk || ''}
                onChange={(e) => setEmployer({ ...employer, kvk: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={employer.website || ''}
                onChange={(e) => setEmployer({ ...employer, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="https://www.voorbeeld.nl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector
              </label>
              <input
                type="text"
                value={employer.sector || ''}
                onChange={(e) => setEmployer({ ...employer, sector: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Bijv: Arbodienst, Verzekeringen, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factuuradres
              </label>
              <textarea
                value={employer.billing_address || ''}
                onChange={(e) => setEmployer({ ...employer, billing_address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Straat 123, 1234 AB Stad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facturatie e-mail
              </label>
              <input
                type="email"
                value={employer.billing_email || ''}
                onChange={(e) => setEmployer({ ...employer, billing_email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="facturen@bedrijf.nl"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto flex items-center justify-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Bezig met opslaan...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}
