import { Link } from 'react-router-dom';
import { AuthLink } from '../components/AuthLink';
import { Building2, UserCheck, ArrowRight, CheckCircle, Clock, Shield, Users, Lightbulb } from 'lucide-react';

export default function Oplossingen() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-slate-400" />
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Oplossingen</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Flexibele inzet in arbeid & gezondheid voor organisaties en professionals.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-10 sm:mb-20">
            <div>
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-slate-700" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Voor organisaties</h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Als arbodienst, werkgever of organisatie heeft u direct toegang tot een netwerk van ervaren bedrijfsartsen en arbo-professionals. Voor verzuimbegeleiding, preventie of re-integratie - wij hebben de juiste professional.
              </p>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 mb-8">
                {[
                  'Plaats snel een opdracht',
                  'Ontvang reacties van BIG-geregistreerde professionals',
                  'Direct contact via het platform',
                  'Geen verborgen kosten of commissies',
                  'Alle contractvormen: ZZP, detachering of loondienst',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#0F172A] font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <AuthLink
                to="/register?type=organisatie"
                className="inline-flex items-center bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Start als opdrachtgever
                <ArrowRight className="w-4 h-4 ml-2" />
              </AuthLink>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-8 border border-slate-200">
              <h3 className="font-bold text-[#0F172A] mb-4">Onze 5 professionals</h3>
              <div className="space-y-3">
                {['Bedrijfsarts', 'Arbo-arts', 'Verzekeringsarts', 'Praktijkondersteuner bedrijfsarts (POB)', 'Casemanager verzuim'].map((profile) => (
                  <div key={profile} className="bg-white rounded-xl px-4 py-3 text-[#0F172A] font-medium border border-slate-200 shadow-sm">
                    {profile}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                <UserCheck className="w-8 h-8 text-slate-700" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Voor professionals</h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Reageer op opdrachten van organisaties. Bepaal zelf waar, wanneer en hoeveel u werkt met flexibele inzetvormen.
              </p>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 mb-8">
                {[
                  'Reageer op opdrachten van organisaties',
                  'Flexibele inzetvormen: ZZP, detachering of loondienst',
                  'Transparante communicatie via het platform',
                  'BIG-verificatie voor extra zichtbaarheid',
                  'Bepaal zelf uw beschikbaarheid',
                  'Direct contact met organisaties',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#0F172A] font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <AuthLink
                to="/register?type=arts"
                className="inline-flex items-center bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Registreer als professional
                <ArrowRight className="w-4 h-4 ml-2" />
              </AuthLink>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-8 border border-slate-200">
              <h3 className="font-bold text-[#0F172A] mb-4">Contractvorm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'ZZP / Freelance', desc: 'Flexibele opdrachten' },
                  { label: 'Detachering', desc: 'Langere projecten' },
                  { label: 'Loondienst', desc: 'Vaste inzet' },
                ].map((type) => (
                  <div key={type.label} className="rounded-xl bg-white shadow-sm border border-slate-200 p-4">
                    <p className="font-semibold text-[#0F172A]">{type.label}</p>
                    <p className="text-sm text-slate-600">{type.desc}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-[#0F172A] mb-4">Voordelen voor professionals</h3>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: 'Flexibiliteit', desc: 'Bepaal zelf uw werktijden en locatie' },
                  { icon: Shield, label: 'Zekerheid', desc: 'Geverifieerde organisaties' },
                  { icon: Users, label: 'Netwerk', desc: 'Bouw aan uw professionele netwerk' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white shadow-sm border border-slate-200 p-4 flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-slate-700 flex-shrink-0" />
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

      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
              Ontdek de mogelijkheden
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              ArboMatcher - Het platform voor organisaties en arbo-professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/opdrachten"
                className="inline-flex items-center justify-center bg-[#0F172A] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Bekijk opdrachten
              </Link>
              <AuthLink
                to="/register"
                className="inline-flex items-center justify-center border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Gratis registreren
              </AuthLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
