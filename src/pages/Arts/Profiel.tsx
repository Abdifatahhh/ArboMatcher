import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Doctor, Profile } from '../../lib/types';
import { Save, AlertCircle } from 'lucide-react';

export default function ArtsProfiel() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [doctor, setDoctor] = useState<Partial<Doctor>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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

    const { data: doctorData } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

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
          .from('doctors')
          .update({
            big_number: doctor.big_number,
            bio: doctor.bio,
            specialties: doctor.specialties,
            regions: doctor.regions,
            hourly_rate: doctor.hourly_rate,
            availability_text: doctor.availability_text,
            verification_status: doctor.verification_status === 'UNVERIFIED' && doctor.big_number ? 'PENDING' : doctor.verification_status
          })
          .eq('id', doctor.id);
      } else if (doctor.big_number) {
        await supabase
          .from('doctors')
          .insert({
            user_id: user.id,
            big_number: doctor.big_number,
            bio: doctor.bio,
            specialties: doctor.specialties || [],
            regions: doctor.regions || [],
            hourly_rate: doctor.hourly_rate,
            availability_text: doctor.availability_text,
            verification_status: 'PENDING',
            premium_status: false
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
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Mijn Profiel</h1>

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BIG-nummer * {doctor.verification_status && (
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
                value={doctor.big_number || ''}
                onChange={(e) => setDoctor({ ...doctor, big_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="123456789"
              />
            </div>

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
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto flex items-center justify-center bg-[#16A34A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#15803d] transition disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Bezig met opslaan...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}
