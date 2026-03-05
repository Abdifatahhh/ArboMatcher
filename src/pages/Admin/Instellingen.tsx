import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Profile } from '../../lib/types';
import { Save, AlertCircle, User, Mail, Phone, Shield } from 'lucide-react';

export default function AdminInstellingen() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) setProfile(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name ?? null,
          phone: profile.phone ?? null,
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      setMessage({ type: 'success', text: 'Instellingen zijn opgeslagen.' });
    } catch {
      setMessage({ type: 'error', text: 'Opslaan mislukt. Probeer het opnieuw.' });
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

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Instellingen</h1>
      <p className="text-gray-600 mb-6">Beheer je accountgegevens als beheerder.</p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          />
          <p className={message.type === 'success' ? 'text-green-900' : 'text-red-900'}>{message.text}</p>
        </div>
      )}

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
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Naam
              </label>
              <input
                id="full_name"
                type="text"
                value={profile.full_name ?? ''}
                onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value || null }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] text-[#0F172A]"
                placeholder="Volledige naam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1.5 text-gray-500" />
                E-mailadres
              </label>
              <input
                type="email"
                value={profile.email ?? user?.email ?? ''}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">E-mail wijzigen kan via inloggegevens of accountbeheer.</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1.5 text-gray-500" />
                Telefoonnummer
              </label>
              <input
                id="phone"
                type="tel"
                value={profile.phone ?? ''}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value || null }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] text-[#0F172A]"
                placeholder="Bijv. 06-12345678"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#4FA151]" />
              Account
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600">
              Je bent ingelogd als <strong>beheerder</strong>. Je hebt toegang tot verificaties, gebruikers en opdrachten.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#3E8E45] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
