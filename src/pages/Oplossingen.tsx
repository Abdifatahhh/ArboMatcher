import { Link } from 'react-router-dom';
import { Building2, Briefcase, UserCheck, ArrowRight, CheckCircle, Clock, Shield, Users, Handshake } from 'lucide-react';

export default function Oplossingen() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Oplossingen</h1>
          <p className="text-xl text-gray-300">
            Flexibele inzet in arbeid & gezondheid voor directe opdrachtgevers, intermediairs en professionals
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Voor directe opdrachtgevers</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Als arbodienst, werkgever of organisatie heeft u direct toegang tot een netwerk van ervaren bedrijfsartsen en arbo-professionals. Voor verzuimbegeleiding, preventie of re-integratie - wij hebben de juiste professional.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Plaats snel een opdracht',
                  'Ontvang reacties van BIG-geregistreerde professionals',
                  'Direct contact via het platform',
                  'Geen verborgen kosten of commissies',
                  'Alle contractvormen: freelance, interim of detachering',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4FA151] flex-shrink-0 mt-0.5" />
                    <span className="text-[#111827]">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register?type=opdrachtgever"
                className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#3E8E45] transition"
              >
                Start als opdrachtgever
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="bg-[#F3F4F6] rounded-[16px] p-8">
              <h3 className="font-bold text-[#0F172A] mb-4">Veelgevraagde profielen</h3>
              <div className="space-y-3">
                {['Bedrijfsarts', 'Arbo-arts', 'Verzuimspecialist', 'Arbeidshygienist', 'Veiligheidskundige'].map((profile) => (
                  <div key={profile} className="bg-white rounded-[12px] px-4 py-3 text-[#0F172A] font-medium">
                    {profile}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1 bg-[#F3F4F6] rounded-[16px] p-8">
              <h3 className="font-bold text-[#0F172A] mb-4">Voordelen voor intermediairs</h3>
              <div className="space-y-4">
                {[
                  { icon: Handshake, label: 'Discrete matching', desc: 'Anoniem publiceren mogelijk' },
                  { icon: Users, label: 'Breed bereik', desc: 'Toegang tot 350+ professionals' },
                  { icon: Shield, label: 'Betrouwbaar', desc: 'BIG-geverifieerde professionals' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-[12px] p-4 flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-[#4FA151] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Voor detacherings- en bemiddelingsbureaus</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Als intermediair plaatst u eenvoudig opdrachten namens uw opdrachtgevers. Vergroot uw bereik binnen de arbo-markt en profiteer van discrete en gerichte matching.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Plaats opdrachten namens uw opdrachtgever',
                  'Vergroot uw bereik binnen de arbo-markt',
                  'Discrete en gerichte matching',
                  'Optie voor anonieme publicatie',
                  'Professioneel platform voor uw dienstverlening',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4FA151] flex-shrink-0 mt-0.5" />
                    <span className="text-[#111827]">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register?type=opdrachtgever"
                className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#3E8E45] transition"
              >
                Start als intermediair
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mb-6">
                <UserCheck className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Voor Professionals</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Reageer op opdrachten van zowel directe opdrachtgevers als bemiddelingsbureaus. Bepaal zelf waar, wanneer en hoeveel u werkt met flexibele inzetvormen.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Reageer op opdrachten van bedrijven en intermediairs',
                  'Flexibele inzetvormen: freelance, interim of detachering',
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
                className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#3E8E45] transition"
              >
                Registreer als professional
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="bg-[#F3F4F6] rounded-[16px] p-8">
              <h3 className="font-bold text-[#0F172A] mb-4">Type inzet</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Freelance', desc: 'Flexibele opdrachten' },
                  { label: 'Interim', desc: 'Tijdelijke vervanging' },
                  { label: 'Detachering', desc: 'Langere projecten' },
                  { label: 'Structureel', desc: 'Vaste inzet' },
                ].map((type) => (
                  <div key={type.label} className="bg-white rounded-[12px] p-4">
                    <p className="font-semibold text-[#0F172A]">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.desc}</p>
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
                  <div key={item.label} className="bg-white rounded-[12px] p-4 flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-[#4FA151] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ontdek de mogelijkheden
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            ArboMatcher - Het platform voor directe opdrachtgevers, intermediairs en arbo-professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/opdrachten"
              className="bg-white text-[#0F172A] px-8 py-4 rounded-[16px] font-semibold hover:bg-gray-100 transition"
            >
              Bekijk opdrachten
            </Link>
            <Link
              to="/register"
              className="bg-[#4FA151] text-white px-8 py-4 rounded-[16px] font-semibold hover:bg-[#3E8E45] transition"
            >
              Gratis registreren
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
