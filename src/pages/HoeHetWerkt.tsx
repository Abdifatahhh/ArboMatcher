import { Link } from 'react-router-dom';
import { UserPlus, FileText, Handshake, ArrowRight, CheckCircle, Shield, Zap, Globe } from 'lucide-react';

export default function HoeHetWerkt() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Hoe ArboMatcher werkt</h1>
          <p className="text-xl text-gray-300">
            Van registratie tot succesvolle samenwerking in drie eenvoudige stappen
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#0F172A] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-10 h-10" />
              </div>
              <div className="text-4xl font-bold text-[#4FA151] mb-4">1</div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Registreer gratis</h3>
              <p className="text-gray-600 leading-relaxed">
                Maak een account aan als professional, organisatie of bemiddelingspartner. Vul uw profiel in met relevante informatie. Volledig gratis en zonder verplichtingen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#0F172A] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10" />
              </div>
              <div className="text-4xl font-bold text-[#4FA151] mb-4">2</div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Plaats of reageer</h3>
              <p className="text-gray-600 leading-relaxed">
                Als organisatie of intermediair plaatst u eenvoudig een opdracht. Als professional bekijkt u beschikbare opdrachten en reageert u direct op opdrachten die bij uw expertise passen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#0F172A] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="w-10 h-10" />
              </div>
              <div className="text-4xl font-bold text-[#4FA151] mb-4">3</div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Start samenwerking</h3>
              <p className="text-gray-600 leading-relaxed">
                Maak direct afspraken via het platform en start de samenwerking. Geen tussenpartijen, geen verborgen kosten. Freelance, interim of detachering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Voor Professionals</h2>
              <div className="space-y-6">
                {[
                  'Gratis registratie en profielaanmaak',
                  'Bekijk alle actuele opdrachten',
                  'Reageer direct op passende opdrachten',
                  'BIG-verificatie voor extra vertrouwen',
                  'Bepaal zelf uw beschikbaarheid',
                  'Direct contact met opdrachtgevers',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[#111827]">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/register?type=arts"
                className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#3E8E45] transition mt-8"
              >
                Registreer als professional
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Voor organisaties en intermediairs</h2>
              <div className="space-y-6">
                {[
                  'Gratis account aanmaken',
                  'Plaats eenvoudig opdrachten',
                  'Ontvang reacties van gekwalificeerde professionals',
                  'Bekijk profielen en kies de beste match',
                  'Direct contact via het platform',
                  'Flexibele inzet: freelance, interim of detachering',
                  'Plaatsen namens opdrachtgever mogelijk (intermediairs)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[#111827]">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/register?type=opdrachtgever"
                className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#3E8E45] transition mt-8"
              >
                Registreer als organisatie of intermediair
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-12">Waarom ArboMatcher?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2">BIG-verificatie</h3>
              <p className="text-sm text-gray-600">Alle professionals worden geverifieerd via hun BIG-registratie</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2">Snel & efficient</h3>
              <p className="text-sm text-gray-600">95% match binnen 48 uur dankzij gerichte matching</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2">Landelijke dekking</h3>
              <p className="text-sm text-gray-600">Professionals in alle 12 provincies van Nederland</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4FA151]/10 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-[#4FA151]" />
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2">Geen tussenpartij</h3>
              <p className="text-sm text-gray-600">Direct contact tussen professional en opdrachtgever</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Registreer gratis en ontdek de mogelijkheden van ArboMatcher.
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
