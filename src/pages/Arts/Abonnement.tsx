import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Check } from 'lucide-react';

type SubscriptionType = 'free' | 'smart' | 'flex';

export default function ArtsAbonnement() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [user]);

  const fetchDoctor = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setDoctor(data);
    }

    setLoading(false);
  };

  const handleSelectPlan = async (plan: SubscriptionType) => {
    if (!user || !doctor) return;

    if (plan === 'free') {
      await supabase
        .from('doctors')
        .update({
          premium_status: false,
          subscription_type: 'free',
          premium_until: null
        })
        .eq('id', doctor.id);
    } else {
      const premiumUntil = new Date();
      if (plan === 'smart') {
        premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
      } else {
        premiumUntil.setMonth(premiumUntil.getMonth() + 3);
      }

      await supabase
        .from('doctors')
        .update({
          premium_status: true,
          subscription_type: plan,
          premium_until: premiumUntil.toISOString()
        })
        .eq('id', doctor.id);
    }

    fetchDoctor();
  };

  const getCurrentPlan = (): SubscriptionType => {
    if (!doctor?.premium_status) return 'free';
    return doctor.subscription_type || 'free';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  const currentPlan = getCurrentPlan();

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Upgrade naar PRO</h1>
        <p className="text-gray-500">
          Word ook PRO en maak nog meer kans op de mooiste opdrachten.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-[#0F172A]">Gratis kennismaken</h3>
              {currentPlan === 'free' && (
                <span className="bg-[#16A34A] text-white text-xs px-2 py-0.5 rounded">Actief</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Voor artsen die eerst kennis willen maken met het platform.
            </p>
            <p className="text-2xl font-bold text-[#0F172A] mb-6">Gratis</p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Direct toegang tot een selectie van opdrachten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Beperkt aantal reacties per week</span>
              </li>
            </ul>
          </div>

          {currentPlan === 'free' ? (
            <div className="text-center py-3 text-gray-400 font-medium">
              Huidig abonnement
            </div>
          ) : (
            <button
              onClick={() => handleSelectPlan('free')}
              className="w-full border border-gray-300 text-[#0F172A] py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Selecteer
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-[#16A34A] text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
              Meest gekozen
            </span>
          </div>

          <div className="flex-1 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-[#0F172A]">Freelance PRO Smart</h3>
              {currentPlan === 'smart' && (
                <span className="bg-[#16A34A] text-white text-xs px-2 py-0.5 rounded">Actief</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Voor artsen die direct willen reageren en de mooiste opdrachten willen scoren.
            </p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-[#0F172A]">&#8364; 159</span>
              <span className="text-gray-400 ml-1 text-sm">per jaar</span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Direct toegang tot alle opdrachten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Onbeperkt reageren op opdrachten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Onbeperkt zoekopdrachten opslaan</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Bespaar 42% t.o.v. een Flex abonnement</span>
              </li>
            </ul>
          </div>

          {currentPlan === 'smart' ? (
            <div className="text-center py-3 text-gray-400 font-medium">
              Huidig abonnement
            </div>
          ) : (
            <button
              onClick={() => handleSelectPlan('smart')}
              className="w-full bg-[#16A34A] text-white py-3 rounded-lg font-semibold hover:bg-[#15803d] transition"
            >
              Ga verder
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-[#0F172A]">Freelance PRO Flex</h3>
              {currentPlan === 'flex' && (
                <span className="bg-[#16A34A] text-white text-xs px-2 py-0.5 rounded">Actief</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Voor artsen die direct willen reageren en de vrijheid van een korter abonnement willen ervaren.
            </p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-[#0F172A]">&#8364; 69</span>
              <span className="text-gray-400 ml-1 text-sm">per kwartaal</span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Direct toegang tot alle opdrachten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Onbeperkt reageren op opdrachten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-600 text-sm">Onbeperkt zoekopdrachten opslaan</span>
              </li>
            </ul>
          </div>

          {currentPlan === 'flex' ? (
            <div className="text-center py-3 text-gray-400 font-medium">
              Huidig abonnement
            </div>
          ) : (
            <button
              onClick={() => handleSelectPlan('flex')}
              className="w-full bg-[#16A34A] text-white py-3 rounded-lg font-semibold hover:bg-[#15803d] transition"
            >
              Ga verder
            </button>
          )}
        </div>
      </div>

      {doctor?.premium_status && doctor?.premium_until && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800">
            Uw {currentPlan === 'smart' ? 'PRO Smart' : 'PRO Flex'} abonnement is actief tot{' '}
            {new Date(doctor.premium_until).toLocaleDateString('nl-NL')}
          </p>
        </div>
      )}
    </div>
  );
}
