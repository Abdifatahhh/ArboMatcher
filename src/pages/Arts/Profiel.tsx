import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Doctor, Profile } from '../../lib/types';
import { PROFESSION_TYPES } from '../Register';
import { Save, AlertCircle, FileText, Upload } from 'lucide-react';

const CV_BUCKET = 'doctor-cvs';

export default function ArtsProfiel({ variant }: { variant?: 'default' | 'onboarding' }) {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [doctor, setDoctor] = useState<Partial<Doctor>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [message, setMessage] = useState('');
  const isOnboarding = variant === 'onboarding';

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    let doctorData = (await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()).data;

    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const metaBig = meta?.big_number ? String(meta.big_number).trim() : '';
    const metaProfession = meta?.profession_type ? String(meta.profession_type).trim() : '';
    const metaRcm = meta?.rcm_number ? String(meta.rcm_number).trim() : '';

    if (doctorData && (metaBig || metaProfession || metaRcm)) {
      const needBig = (!doctorData.big_number || doctorData.big_number === '') && metaBig;
      const needProf = !doctorData.profession_type && metaProfession;
      const needRcm = (doctorData.rcm_number == null || doctorData.rcm_number === '') && metaRcm;
      if (needBig || needProf || needRcm) {
        const updates: { big_number?: string | null; profession_type?: string | null; rcm_number?: string | null } = {};
        if (needBig) updates.big_number = metaBig;
        if (needProf) updates.profession_type = metaProfession;
        if (needRcm) updates.rcm_number = metaRcm;
        const { data: updated } = await supabase
          .from('professionals')
          .update(updates)
          .eq('id', doctorData.id)
          .select()
          .single();
        if (updated) doctorData = updated;
      }
    } else if (!doctorData && (metaBig || metaProfession)) {
      const { data: inserted } = await supabase
        .from('professionals')
        .insert({
          user_id: user.id,
          big_number: metaBig || null,
          profession_type: metaProfession || null,
          rcm_number: metaRcm || null,
          verification_status: metaBig && metaBig.length >= 8 ? 'PENDING' : 'UNVERIFIED',
          doctor_plan: 'BASIC',
          specialties: [],
          regions: [],
        })
        .select()
        .single();
      if (inserted) doctorData = inserted;
    }

    if (profileData) setProfile(profileData);
    if (doctorData) setDoctor(doctorData);

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

      if (doctor.id) {
        await supabase
          .from('professionals')
          .update({
            big_number: doctor.big_number?.trim() || null,
            profession_type: doctor.profession_type,
            rcm_number: doctor.rcm_number?.trim() || null,
            bio: doctor.bio,
            specialties: doctor.specialties,
            regions: doctor.regions,
            hourly_rate: doctor.hourly_rate,
            availability_text: doctor.availability_text,
            cv_url: doctor.cv_url,
            verification_status: doctor.verification_status === 'UNVERIFIED' && (doctor.big_number?.trim() || '').length >= 8 ? 'PENDING' : doctor.verification_status
          })
          .eq('id', doctor.id);
      } else {
        await supabase
          .from('professionals')
          .insert({
            user_id: user.id,
            big_number: doctor.big_number?.trim() || null,
            profession_type: doctor.profession_type,
            rcm_number: doctor.rcm_number?.trim() || null,
            bio: doctor.bio,
            specialties: doctor.specialties || [],
            regions: doctor.regions || [],
            hourly_rate: doctor.hourly_rate,
            availability_text: doctor.availability_text,
            cv_url: doctor.cv_url,
            verification_status: (doctor.big_number?.trim() || '').length >= 8 ? 'PENDING' : 'UNVERIFIED',
            doctor_plan: 'BASIC'
          });
      }

      await refreshProfile();
      setMessage('Profiel succesvol opgeslagen!');
      fetchData();
      window.dispatchEvent(new CustomEvent('arts-profile-saved'));
    } catch (error) {
      setMessage('Er is een fout opgetreden bij het opslaan');
    }

    setSaving(false);
  };

  const CV_ACCEPT = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!CV_ACCEPT.includes(file.type)) {
      setMessage('Alleen PDF of Word (.doc, .docx) is toegestaan.');
      return;
    }
    setUploadingCv(true);
    setMessage('');
    try {
      const ext = file.name.split('.').pop() || 'pdf';
      const path = `${user.id}/cv-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(CV_BUCKET).upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from(CV_BUCKET).getPublicUrl(path);
      setDoctor({ ...doctor, cv_url: urlData.publicUrl });
      setMessage('CV geüpload. Klik Opslaan om te bevestigen.');
    } catch (err: any) {
      setMessage(err?.message || 'Upload mislukt. Controleer of de bucket bestaat.');
    }
    setUploadingCv(false);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  return (
    <div className={isOnboarding ? 'max-w-2xl mx-auto' : 'p-6 max-w-4xl'}>
      <h1 className={`font-bold text-[#0F172A] mb-6 ${isOnboarding ? 'text-2xl text-center' : 'text-3xl'}`}>
        {isOnboarding ? 'Voltooi je profiel' : 'Mijn Profiel'}
      </h1>

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
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Persoonlijke gegevens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volledige naam *
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
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Professionele gegevens</h2>
          <div className="space-y-4">
            {doctor.profession_type && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beroep</label>
                <p className="text-[#0F172A] font-medium">
                  {PROFESSION_TYPES.find((p) => p.value === doctor.profession_type)?.label ?? doctor.profession_type}
                </p>
              </div>
            )}
            {(doctor.profession_type === 'CASEMANAGER_VERZUIM' || doctor.rcm_number != null) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RCM-nummer (optioneel)</label>
                <input
                  type="text"
                  value={doctor.rcm_number || ''}
                  onChange={(e) => setDoctor({ ...doctor, rcm_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="RCM-nummer"
                />
              </div>
            )}
            {(!doctor.profession_type || doctor.profession_type !== 'CASEMANAGER_VERZUIM') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BIG-nummer * (min. 8 cijfers) {doctor.verification_status && doctor.profession_type !== 'CASEMANAGER_VERZUIM' && (
                    <span className={`ml-2 text-sm ${
                      doctor.verification_status === 'VERIFIED' ? 'text-green-600' :
                      doctor.verification_status === 'PENDING' ? 'text-yellow-600' :
                      doctor.verification_status === 'REJECTED' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      ({doctor.verification_status === 'VERIFIED' ? 'Geverifieerd' :
                        doctor.verification_status === 'PENDING' ? 'In behandeling' :
                        doctor.verification_status === 'REJECTED' ? 'Afgewezen' :
                        'Niet geverifieerd'})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={doctor.big_number || ''}
                  onChange={(e) => setDoctor({ ...doctor, big_number: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="Alleen cijfers, min. 8"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={doctor.bio || ''}
                onChange={(e) => setDoctor({ ...doctor, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Vertel iets over uzelf en uw ervaring..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialisaties (kommagescheiden)
              </label>
              <input
                type="text"
                value={doctor.specialties?.join(', ') || ''}
                onChange={(e) => setDoctor({ ...doctor, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Bedrijfsgeneeskunde, Verzekeringsgeneeskunde"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regio's (kommagescheiden)
              </label>
              <input
                type="text"
                value={doctor.regions?.join(', ') || ''}
                onChange={(e) => setDoctor({ ...doctor, regions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Amsterdam, Utrecht, Rotterdam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uurtarief (€)
              </label>
              <input
                type="number"
                value={doctor.hourly_rate || ''}
                onChange={(e) => setDoctor({ ...doctor, hourly_rate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="125"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschikbaarheid
              </label>
              <textarea
                value={doctor.availability_text || ''}
                onChange={(e) => setDoctor({ ...doctor, availability_text: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Bijv: Beschikbaar vanaf 1 april, 3 dagen per week"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV (PDF of Word)
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition text-sm">
                  <Upload className="w-4 h-4" />
                  {uploadingCv ? 'Bezig...' : 'Kies bestand'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleCvUpload}
                    disabled={uploadingCv}
                  />
                </label>
                {doctor.cv_url && (
                  <a
                    href={doctor.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#4FA151] hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    Huidige CV bekijken
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full flex items-center justify-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50 ${isOnboarding ? '' : 'md:w-auto'}`}
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Bezig met opslaan...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}
