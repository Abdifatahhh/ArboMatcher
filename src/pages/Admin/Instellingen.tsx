import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Profile } from '../../lib/types';
import { Save, User, Shield, Lock } from 'lucide-react';
import { MAINTENANCE_STORAGE_KEY } from '../../lib/maintenance';
import { AdminPage, AdminPageHeader, AdminCard, AdminAlert, AdminLoadingState } from '../../components/Admin/adminUI';
import { Settings } from 'lucide-react';

const fi = 'w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition';
const fd = 'w-full h-10 px-3 border border-slate-100 rounded-lg text-sm text-slate-500 bg-slate-50';
const fl = 'block text-sm font-medium text-slate-700 mb-1.5';
const ft = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-y';

export default function AdminInstellingen() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenancePassword, setMaintenancePassword] = useState('');
  const [maintenanceMessage, setMaintenanceMessage] = useState('Website is momenteel in onderhoud.');

  useEffect(() => { fetchProfile(); }, [user]);
  useEffect(() => {
    try { const stored = localStorage.getItem(MAINTENANCE_STORAGE_KEY); if (stored) { const data = JSON.parse(stored); setMaintenanceEnabled(!!data.enabled); setMaintenancePassword(data.password ?? ''); setMaintenanceMessage(data.message ?? 'Website is momenteel in onderhoud.'); } } catch {}
  }, []);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) setProfile(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setMessage(null);
    try {
      const { error } = await supabase.from('profiles').update({ full_name: profile.full_name ?? null, phone: profile.phone ?? null }).eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      setMessage({ type: 'success', text: 'Instellingen opgeslagen.' });
    } catch { setMessage({ type: 'error', text: 'Opslaan mislukt.' }); }
    setSaving(false);
  };

  const handleSaveMaintenance = () => {
    try {
      localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify({ enabled: maintenanceEnabled, password: maintenancePassword, message: maintenanceMessage || 'Website is momenteel in onderhoud.' }));
      setMessage({ type: 'success', text: 'Onderhoudsinstellingen opgeslagen.' });
    } catch { setMessage({ type: 'error', text: 'Opslaan mislukt.' }); }
  };

  if (loading) return <AdminPage><AdminLoadingState rows={4} /></AdminPage>;

  return (
    <AdminPage className="max-w-2xl">
      <AdminPageHeader icon={Settings} title="Instellingen" description="Beheer je accountgegevens als beheerder" />
      {message && <AdminAlert variant={message.type === 'success' ? 'success' : 'error'} onClose={() => setMessage(null)}>{message.text}</AdminAlert>}

      <form onSubmit={handleSave} className="space-y-5">
        <AdminCard title="Persoonlijke gegevens" actions={<User className="w-4 h-4 text-slate-400" />}>
          <div className="space-y-4">
            <div><label htmlFor="full_name" className={fl}>Naam</label><input id="full_name" type="text" value={profile.full_name ?? ''} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value || null }))} className={fi} placeholder="Volledige naam" /></div>
            <div><label className={fl}>E-mailadres</label><input type="email" value={profile.email ?? user?.email ?? ''} disabled className={fd} /><p className="mt-1 text-xs text-slate-400">E-mail wijzigen kan via accountbeheer.</p></div>
            <div><label htmlFor="phone" className={fl}>Telefoonnummer</label><input id="phone" type="tel" value={profile.phone ?? ''} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value || null }))} className={fi} placeholder="06-12345678" /></div>
          </div>
        </AdminCard>

        <AdminCard title="Account" actions={<Shield className="w-4 h-4 text-slate-400" />}>
          <p className="text-sm text-slate-600">Je bent ingelogd als <span className="font-medium text-slate-900">beheerder</span>. Je hebt toegang tot verificaties, gebruikers en opdrachten.</p>
        </AdminCard>

        <AdminCard title="Onderhoudsmodus" actions={<Lock className="w-4 h-4 text-slate-400" />}>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Onderhoudsmodus inschakelen</p>
                <p className="text-xs text-slate-500 mt-0.5">Schakel de website in onderhoudsmodus</p>
              </div>
              <button type="button" role="switch" aria-checked={maintenanceEnabled} onClick={() => setMaintenanceEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${maintenanceEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${maintenanceEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div><label htmlFor="maintenance_password" className={fl}>Toegangswachtwoord</label><input id="maintenance_password" type="password" value={maintenancePassword} onChange={(e) => setMaintenancePassword(e.target.value)} placeholder="Wachtwoord tijdens onderhoud" className={fi} /></div>
            <div><label htmlFor="maintenance_message" className={fl}>Onderhoudsbericht</label><textarea id="maintenance_message" rows={3} value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} className={ft} /></div>
            <div className="flex justify-end">
              <button type="button" onClick={handleSaveMaintenance} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
                <Save className="w-4 h-4" /> Onderhoud opslaan
              </button>
            </div>
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition">
            <Save className="w-4 h-4" /> {saving ? 'Opslaan...' : 'Profiel opslaan'}
          </button>
        </div>
      </form>
    </AdminPage>
  );
}
