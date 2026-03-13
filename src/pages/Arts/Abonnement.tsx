import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { DoctorPlan } from '../../lib/types';
import { Check } from 'lucide-react';

export default function ArtsAbonnement() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<{ id: string; doctor_plan: DoctorPlan } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [user]);

  const fetchDoctor = async () => {
    if (!user) return;
    const { data } = await supabase.from('professionals').select('id, doctor_plan').eq('user_id', user.id).maybeSingle();
    if (data) setDoctor(data);
    setLoading(false);
  };

  const handleSelectPlan = async (plan: DoctorPlan) => {
    if (!user || !doctor) return;
    await supabase.from('professionals').update({ doctor_plan: plan }).eq('id', doctor.id);
    fetchDoctor();
  };

  const currentPlan: DoctorPlan = doctor?.doctor_plan === 'PRO' ? 'PRO' : 'GRATIS';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Upgrade naar PRO</h1>
        <p className="text-gray-500">
          Word PRO en reager direct op alle opdrachten. Gratis-professionals kunnen na 48 uur op PRO-opdrachten reageren.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-[#0F172A]">Gratis kennismaken</h3>
              {currentPlan === 'GRATIS' && (
                <span className="bg-[#4FA151] text-white text-xs px-2 py-0.5 rounded">Actief</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Voor freelancers die eerst kennis willen maken met het platform.
            </p>
            <p className="text-2xl font-bold text-[#0F172A] mb-6">Gratis</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#4FA151] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Direct toegang tot een selectie van opdrachten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#4FA151] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Beperkt aantal reacties per week</span>
              </li>
            </ul>
          </div>
          {currentPlan === 'GRATIS' ? (
            <div className="text-center py-3 text-gray-400 font-medium">Huidig abonnement</div>
          ) : (
            <button
              onClick={() => handleSelectPlan('GRATIS')}
              className="w-full border border-gray-300 text-[#0F172A] py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Selecteer Gratis
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-[#4FA151] p-6 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-[#4FA151] text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
              Aanbevolen
            </span>
          </div>
          <div className="flex-1 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-[#0F172A]">PRO</h3>
              {currentPlan === 'PRO' && (
                <span className="bg-[#4FA151] text-white text-xs px-2 py-0.5 rounded">Actief</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Reager direct op alle opdrachten, ook PRO-opdrachten in de eerste 48 uur.
            </p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-[#0F172A]">€ —</span>
              <span className="text-gray-400 ml-1 text-sm">per jaar</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#4FA151] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Direct reageren op alle opdrachten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#4FA151] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Geen 48-uurs wachttijd</span>
              </li>
            </ul>
          </div>
          {currentPlan === 'PRO' ? (
            <div className="text-center py-3 text-gray-400 font-medium">Huidig abonnement</div>
          ) : (
            <button
              onClick={() => handleSelectPlan('PRO')}
              className="w-full bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
            >
              Upgrade naar PRO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
