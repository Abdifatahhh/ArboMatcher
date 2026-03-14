import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { DoctorPlan } from '../../lib/types';
import { Check } from 'lucide-react';

export default function ArtsAbonnement() {
  const { user } = useAuth();
  const [professional, setProfessional] = useState<{ id: string; plan: DoctorPlan } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessional();
  }, [user]);

  const fetchProfessional = async () => {
    if (!user) return;
    const { data } = await supabase.from('professionals').select('id, plan').eq('user_id', user.id).maybeSingle();
    if (data) setProfessional(data);
    setLoading(false);
  };

  const handleSelectPlan = async (plan: DoctorPlan) => {
    if (!user || !professional) return;
    await supabase.from('professionals').update({ plan }).eq('id', professional.id);
    fetchProfessional();
  };

  const currentPlan: DoctorPlan = professional?.plan === 'PRO' ? 'PRO' : 'GRATIS';

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
        <p className="text-slate-500">
          Word PRO en reager direct op alle opdrachten. Gratis-professionals kunnen na 48 uur op PRO-opdrachten reageren.
        </p>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-[#0F172A]">Gratis kennismaken</h3>
                {currentPlan === 'GRATIS' && (
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">Actief</span>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                Voor freelancers die eerst kennis willen maken met het platform.
              </p>
              <p className="text-3xl font-bold text-[#0F172A] mb-6">Gratis</p>
              <ul className="space-y-3 mb-6">
                {['Toegang tot een selectie van opdrachten', 'Beperkt aantal reacties per week', 'Profiel aanmaken', 'E-mail notificaties'].map((f) => (
                  <li key={f} className="flex items-start">
                    <Check className="w-4 h-4 text-slate-400 mr-2.5 mt-0.5 flex-shrink-0" strokeWidth={3} />
                    <span className="text-slate-600 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {currentPlan === 'GRATIS' ? (
              <div className="text-center py-3 text-slate-400 font-medium text-sm border border-slate-200 rounded-xl bg-slate-50">Huidig abonnement</div>
            ) : (
              <button
                onClick={() => handleSelectPlan('GRATIS')}
                className="w-full border border-slate-200 text-[#0F172A] py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Selecteer Gratis
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border-2 border-[#0F172A] p-6 flex flex-col relative shadow-lg shadow-slate-900/5">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-emerald-500 to-green-400 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                Aanbevolen
              </span>
            </div>
            <div className="flex-1 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-[#0F172A]">PRO</h3>
                {currentPlan === 'PRO' && (
                  <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Actief</span>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                Reager direct op alle opdrachten, ook PRO-opdrachten in de eerste 48 uur.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F172A]">€ —</span>
                <span className="text-slate-400 ml-1 text-sm">/ jaar</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['Direct reageren op alle opdrachten', 'Geen 48-uurs wachttijd op PRO-opdrachten', 'Premium profiel zichtbaarheid', 'Onbeperkt aantal reacties', 'Prioriteit bij matching'].map((f) => (
                  <li key={f} className="flex items-start">
                    <Check className="w-4 h-4 text-[#0F172A] mr-2.5 mt-0.5 flex-shrink-0" strokeWidth={3} />
                    <span className="text-slate-600 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {currentPlan === 'PRO' ? (
              <div className="text-center py-3 text-slate-400 font-medium text-sm border border-slate-200 rounded-xl bg-slate-50">Huidig abonnement</div>
            ) : (
              <button
                onClick={() => handleSelectPlan('PRO')}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
              >
                Upgrade naar PRO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
