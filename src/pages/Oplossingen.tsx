import { Link } from 'react-router-dom';
import { Building2, UserCheck, ArrowRight, CheckCircle, Clock, Shield, Users, Lightbulb } from 'lucide-react';

export default function Oplossingen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-[#4FA151]" />
            <span className="text-[#4FA151] font-semibold text-sm uppercase tracking-wider">Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Oplossingen</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Flexibele inzet in arbeid & gezondheid voor opdrachtgevers en professionals.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Voor opdrachtgevers</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Als arbodienst, werkgever of organisatie heeft u direct toegang tot een netwerk van ervaren bedrijfsartsen en arbo-professionals. Voor verzuimbegeleiding, preventie of re-integratie - wij hebben de juiste professional.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Plaats snel een opdracht',
                  'Ontvang reacties van BIG-geregistreerde professionals',
                  'Direct contact via het platform',
                  'Geen verborgen kosten of commissies',
                  'Alle contractvormen: ZZP, detachering of loondienst',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4FA151] flex-shrink-0 mt-0.5" />
                    <span className="text-[#111827]">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register?type=opdrachtgever"
                className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
              >
                Start als opdrachtgever
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="bg-[#F4FAF4] rounded-[16px] p-8 border border-[#4FA151]/15 shadow-lg shadow-slate-200/30">
              <h3 className="font-bold text-[#0F172A] mb-4">Onze 5 professionals</h3>
              <div className="space-y-3">
                {['Bedrijfsarts', 'Arbo-arts', 'Verzekeringsarts', 'Praktijkondersteuner bedrijfsarts (POB)', 'Casemanager verzuim'].map((profile) => (
                  <div key={profile} className="bg-[#FFFFFF] rounded-[12px] px-4 py-3 text-[#0F172A] font-medium border border-[#4FA151]/15 shadow-lg shadow-slate-200/30">
                    {profile}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mb-6">
                <UserCheck className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Voor Professionals</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Reageer op opdrachten van opdrachtgevers. Bepaal zelf waar, wanneer en hoeveel u werkt met flexibele inzetvormen.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Reageer op opdrachten van opdrachtgevers',
                  'Flexibele inzetvormen: ZZP, detachering of loondienst',
                  'Transparante communicatie via het platform',
                  'BIG-verificatie voor extra zichtbaarheid',
                  'Bepaal zelf uw beschikbaarheid',
                  'Direct contact met opdrachtgevers',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4FA151] flex-shrink-0 mt-0.5" />
                    <span className="text-[#111827]">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register?type=arts"
                className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
              >
                Registreer als professional
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="bg-[#F4FAF4] rounded-[16px] p-8 border border-[#4FA151]/15 shadow-lg shadow-slate-200/30">
              <h3 className="font-bold text-[#0F172A] mb-4">Contractvorm</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'ZZP / Freelance', desc: 'Flexibele opdrachten' },
                  { label: 'Detachering', desc: 'Langere projecten' },
                  { label: 'Loondienst', desc: 'Vaste inzet' },
                ].map((type) => (
                  <div
                    key={type.label}
                    className="rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 p-4"
                  >
                    <p className="font-semibold text-[#0F172A]">{type.label}</p>
                    <p className="text-sm text-slate-600">{type.desc}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-[#0F172A] mb-4">Voordelen voor professionals</h3>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: 'Flexibiliteit', desc: 'Bepaal zelf uw werktijden en locatie' },
                  { icon: Shield, label: 'Zekerheid', desc: 'Geverifieerde opdrachtgevers' },
                  { icon: Users, label: 'Netwerk', desc: 'Bouw aan uw professionele netwerk' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 p-4 flex items-start gap-4"
                  >
                    <item.icon className="w-6 h-6 text-[#4FA151] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">{item.label}</p>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F4FAF4] rounded-2xl border border-[#4FA151]/15 shadow-lg shadow-slate-200/30 p-8 sm:p-10 hover:shadow-[#4FA151]/10 hover:border-[#4FA151]/25 transition-all duration-300 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
              Ontdek de mogelijkheden
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              ArboMatcher - Het platform voor opdrachtgevers en arbo-professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/opdrachten"
                className="inline-flex items-center justify-center bg-[#0F172A] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Bekijk opdrachten
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-[#4FA151] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
              >
                Gratis registreren
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
