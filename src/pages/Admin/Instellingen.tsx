import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Profile } from '../../lib/types';
import { Save, AlertCircle, User, Mail, Phone, Shield, Lock } from 'lucide-react';
import { MAINTENANCE_STORAGE_KEY } from '../../lib/maintenance';

export default function AdminInstellingen() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenancePassword, setMaintenancePassword] = useState('');
  const [maintenanceMessage, setMaintenanceMessage] = useState('Website is momenteel in onderhoud.');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setMaintenanceEnabled(!!data.enabled);
        setMaintenancePassword(data.password ?? '');
        setMaintenanceMessage(data.message ?? 'Website is momenteel in onderhoud.');
      }
    } catch {
      // ignore
    }
  }, []);

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

  const handleSaveMaintenance = () => {
    try {
      localStorage.setItem(
        MAINTENANCE_STORAGE_KEY,
        JSON.stringify({
          enabled: maintenanceEnabled,
          password: maintenancePassword,
          message: maintenanceMessage || 'Website is momenteel in onderhoud.',
        })
      );
      setMessage({ type: 'success', text: 'Onderhoudsinstellingen opgeslagen.' });
    } catch {
      setMessage({ type: 'error', text: 'Onderhoudsinstellingen opslaan mislukt.' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] rounded-xl bg-white/60 border border-emerald-100">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Instellingen</h1>
      <p className="text-emerald-700/80 text-sm mb-6">Beheer je accountgegevens als beheerder.</p>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`} />
          <p className={message.type === 'success' ? 'text-emerald-900' : 'text-red-900'}>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#3E8E45] bg-[#4FA151]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              Persoonlijke gegevens
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-emerald-800/80 mb-2">Naam</label>
              <input id="full_name" type="text" value={profile.full_name ?? ''} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value || null }))} className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] text-[#0F172A] transition" placeholder="Volledige naam" />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-800/80 mb-2"><Mail className="w-4 h-4 inline mr-1.5 text-emerald-600" />E-mailadres</label>
              <input type="email" value={profile.email ?? user?.email ?? ''} disabled className="w-full px-4 py-2.5 border border-emerald-100 rounded-xl bg-emerald-50/50 text-gray-600 cursor-not-allowed" />
              <p className="mt-1 text-xs text-gray-500">E-mail wijzigen kan via inloggegevens of accountbeheer.</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-emerald-800/80 mb-2"><Phone className="w-4 h-4 inline mr-1.5 text-emerald-600" />Telefoonnummer</label>
              <input id="phone" type="tel" value={profile.phone ?? ''} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value || null }))} className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] text-[#0F172A] transition" placeholder="Bijv. 06-12345678" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#3E8E45] bg-[#4FA151]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              Account
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600">Je bent ingelogd als <strong>beheerder</strong>. Je hebt toegang tot verificaties, gebruikers en opdrachten.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#3E8E45] bg-[#4FA151]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-white" />
              Onderhoudsmodus
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Onderhoudsmodus inschakelen</p>
                <p className="text-sm text-gray-500 mt-0.5">Schakel de website in onderhoudsmodus</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={maintenanceEnabled}
                onClick={() => setMaintenanceEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4FA151] focus:ring-offset-2 ${maintenanceEnabled ? 'bg-[#4FA151]' : 'bg-gray-200'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${maintenanceEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </button>
            </div>
            <div>
              <label htmlFor="maintenance_password" className="block text-sm font-semibold text-[#0F172A] mb-2">Toegangswachtwoord</label>
              <input
                id="maintenance_password"
                type="password"
                value={maintenancePassword}
                onChange={(e) => setMaintenancePassword(e.target.value)}
                placeholder="Wachtwoord voor toegang tijdens onderhoud"
                className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] text-[#0F172A] transition placeholder:text-gray-400"
              />
            </div>
            <div>
              <label htmlFor="maintenance_message" className="block text-sm font-semibold text-[#0F172A] mb-2">Onderhoudsbericht</label>
              <textarea
                id="maintenance_message"
                rows={4}
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Website is momenteel in onderhoud."
                className="w-full px-4 py-2.5 border border-emerald-200/80 rounded-xl focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] text-[#0F172A] transition placeholder:text-gray-400 resize-y"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveMaintenance}
                className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#3E8E45] transition"
              >
                <Save className="w-4 h-4" />
                Onderhoudsinstellingen opslaan
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#3E8E45] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
