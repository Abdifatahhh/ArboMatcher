import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Shield,
  ArrowRight,
  Building2,
  Briefcase,
  UserCheck,
  Lock,
  Zap,
  Globe,
  Award,
  FileText
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    navigate(`/opdrachten?${params.toString()}`);
  };

  return (
    <div className="font-['Inter']">
      <section className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white pt-32 pb-32 sm:pt-40 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#4FA151]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1E293B]/50 rounded-full blur-3xl" />
          <svg className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5" width="700" height="700" viewBox="0 0 700 700">
            <circle cx="350" cy="350" r="200" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="350" cy="350" r="280" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="350" cy="350" r="120" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M350 70 L350 630 M70 350 L630 350" stroke="currentColor" strokeWidth="1" />
            <circle cx="350" cy="150" r="8" fill="#4FA151" />
            <circle cx="550" cy="350" r="8" fill="#4FA151" />
            <circle cx="350" cy="550" r="8" fill="#4FA151" />
            <circle cx="150" cy="350" r="8" fill="#4FA151" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Alle organisaties en arbo-professionals efficient verbonden.
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              ArboMatcher verbindt directe opdrachtgevers en intermediairs met gekwalificeerde bedrijfsartsen en arbo-professionals voor freelance, interim en detachering.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[16px] shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op specialisatie, regio of type inzet"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-[12px] focus:ring-2 focus:ring-[#4FA151] text-[#111827] placeholder:text-gray-400 text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-[#4FA151] text-white px-8 py-4 rounded-[12px] font-semibold hover:bg-[#3E8E45] transition whitespace-nowrap text-lg"
              >
                Bekijk actuele opdrachten
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-6 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4FA151]" />
              Landelijke dekking
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4FA151]" />
              BIG-geverifieerde professionals
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4FA151]" />
              Geschikt voor directe opdrachtgevers en intermediairs
            </span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Hoe ArboMatcher werkt</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Van registratie tot samenwerking in drie eenvoudige stappen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0F172A] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Registreer gratis</h3>
              <p className="text-gray-600">
                Maak een account aan als professional, organisatie of bemiddelingspartner. Volledig gratis en zonder verplichtingen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0F172A] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Plaats of reageer</h3>
              <p className="text-gray-600">
                Plaats een opdracht of reageer direct op beschikbare opdrachten die bij uw expertise passen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0F172A] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Start samenwerking</h3>
              <p className="text-gray-600">
                Maak direct afspraken en start de samenwerking. Freelance, interim of detachering.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/hoe-het-werkt"
              className="inline-flex items-center text-[#4FA151] font-semibold hover:text-[#3E8E45] transition"
            >
              Meer over hoe het werkt
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Oplossingen voor iedereen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Of u nu een directe opdrachtgever, bemiddelingsbureau of professional bent, ArboMatcher biedt de juiste oplossing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[16px] p-8 shadow-sm">
              <Building2 className="w-12 h-12 text-[#4FA151] mb-6" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Voor directe opdrachtgevers</h3>
              <p className="text-gray-600 mb-6">
                Direct toegang tot een netwerk van ervaren bedrijfsartsen voor verzuimbegeleiding, preventie en re-integratie.
              </p>
              <Link
                to="/oplossingen"
                className="inline-flex items-center text-[#4FA151] font-semibold hover:text-[#3E8E45] transition"
              >
                Meer informatie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-white rounded-[16px] p-8 shadow-sm">
              <Briefcase className="w-12 h-12 text-[#4FA151] mb-6" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Voor intermediairs</h3>
              <p className="text-gray-600 mb-6">
                Vergroot uw bereik binnen de arbo-markt en plaats opdrachten namens uw opdrachtgevers via een platform.
              </p>
              <Link
                to="/oplossingen"
                className="inline-flex items-center text-[#4FA151] font-semibold hover:text-[#3E8E45] transition"
              >
                Meer informatie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-white rounded-[16px] p-8 shadow-sm">
              <UserCheck className="w-12 h-12 text-[#4FA151] mb-6" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Voor Professionals</h3>
              <p className="text-gray-600 mb-6">
                Reageer op opdrachten van zowel directe opdrachtgevers als bemiddelingsbureaus met flexibele inzetvormen.
              </p>
              <Link
                to="/oplossingen"
                className="inline-flex items-center text-[#4FA151] font-semibold hover:text-[#3E8E45] transition"
              >
                Meer informatie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Waarom ArboMatcher?</h2>
              <div className="space-y-6">
                {[
                  { icon: Shield, text: 'BIG-verificatie van alle professionals' },
                  { icon: Lock, text: 'AVG-proof communicatie' },
                  { icon: Zap, text: 'Direct contact zonder traditionele tussenpartij' },
                  { icon: Globe, text: 'Landelijke dekking in alle 12 provincies' },
                  { icon: Award, text: 'Geschikt voor directe opdrachtgevers en intermediairs' },
                  { icon: Briefcase, text: 'Freelance, interim en detachering via een platform' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#4FA151]" />
                    </div>
                    <p className="text-[#111827] text-lg">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F3F4F6] rounded-[16px] p-8">
              <FileText className="w-12 h-12 text-[#4FA151] mb-6" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">
                Bekijk alle opdrachten
              </h3>
              <p className="text-gray-600 mb-6">
                Opdrachten zijn publiek zichtbaar. Maak een gratis account aan om te reageren of zelf opdrachten te plaatsen.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/opdrachten"
                  className="inline-flex items-center justify-center bg-[#0F172A] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#1E293B] transition"
                >
                  Bekijk opdrachten
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-[#4FA151] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-[#3E8E45] transition"
                >
                  Gratis registreren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sluit u aan bij ArboMatcher
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Het platform voor organisaties, bemiddelingspartners en arbo-professionals.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-[#4FA151] text-white px-8 py-4 rounded-[16px] font-semibold hover:bg-[#3E8E45] transition text-lg shadow-lg shadow-[#4FA151]/25"
          >
            Gratis registreren
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
