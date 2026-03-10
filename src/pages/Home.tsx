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
  FileText,
  UserPlus,
  PenLine,
  Handshake
} from 'lucide-react';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { HowItWorksSectionOpdrachtgevers } from '../components/home/HowItWorksSectionOpdrachtgevers';

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
              Opdrachtgevers en arbo-professionals efficiënt verbonden.
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              ArboMatcher verbindt opdrachtgevers met gekwalificeerde bedrijfsartsen en arbo-professionals voor freelance, interim en detachering.
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
                className="bg-[#4FA151] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#3E8E45] transition whitespace-nowrap text-lg"
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
              Eén platform voor opdrachtgevers en professionals
            </span>
          </div>
        </div>
      </section>

      <HowItWorksSectionOpdrachtgevers />

      <HowItWorksSection />

      <section className="py-24 bg-gradient-to-b from-[#F4FAF4] to-[#FAFDFA] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">Hoe ArboMatcher werkt</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Van registratie tot samenwerking in drie eenvoudige stappen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            <div className="relative flex flex-col items-center md:block">
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/30 p-8 hover:shadow-xl hover:shadow-slate-200/40 hover:border-[#4FA151]/30 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 flex items-center justify-center text-white shadow-lg shrink-0">
                    <UserPlus className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stap 1</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Registreer gratis</h3>
                <p className="text-slate-600 leading-relaxed flex-1">
                  Maak een account aan als professional, organisatie of bemiddelingspartner. Volledig gratis en zonder verplichtingen.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-8 h-0.5 bg-gradient-to-r from-slate-200 to-transparent z-0" aria-hidden />
            </div>

            <div className="relative flex flex-col items-center md:block">
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/30 p-8 hover:shadow-xl hover:shadow-slate-200/40 hover:border-[#4FA151]/30 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 flex items-center justify-center text-white shadow-lg shrink-0">
                    <PenLine className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stap 2</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Plaats of reageer</h3>
                <p className="text-slate-600 leading-relaxed flex-1">
                  Plaats een opdracht of reageer direct op beschikbare opdrachten die bij uw expertise passen.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-8 h-0.5 bg-gradient-to-r from-slate-200 to-transparent z-0" aria-hidden />
            </div>

            <div className="relative flex flex-col items-center md:block">
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/30 p-8 hover:shadow-xl hover:shadow-slate-200/40 hover:border-[#4FA151]/30 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4FA151] to-[#3E8E45] flex items-center justify-center text-white shadow-lg shadow-[#4FA151]/25 shrink-0">
                    <Handshake className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stap 3</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Start samenwerking</h3>
                <p className="text-slate-600 leading-relaxed flex-1">
                  Maak direct afspraken en start de samenwerking. Freelance, interim of detachering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-[#FAFDFA] to-[#FDFEFD] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-block text-[#4FA151] font-semibold text-sm uppercase tracking-widest mb-3">Doelgroep</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">Oplossingen voor iedereen</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Of u nu opdrachtgever of professional bent, ArboMatcher biedt de juiste oplossing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <Link
              to="/oplossingen"
              className="group block bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/30 p-8 hover:shadow-xl hover:shadow-slate-200/40 hover:border-[#4FA151]/30 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Voor opdrachtgevers</h3>
              <p className="text-slate-600 leading-relaxed flex-1 mb-6">
                Direct toegang tot een netwerk van ervaren bedrijfsartsen voor verzuimbegeleiding, preventie en re-integratie.
              </p>
              <span className="inline-flex items-center text-[#4FA151] font-semibold group-hover:gap-3 transition-all gap-2">
                Meer informatie
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/oplossingen"
              className="group block bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/30 p-8 hover:shadow-xl hover:shadow-slate-200/40 hover:border-[#4FA151]/30 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4FA151] to-[#3E8E45] flex items-center justify-center text-white shadow-lg shadow-[#4FA151]/25 mb-6 group-hover:scale-105 transition-transform">
                <UserCheck className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Voor Professionals</h3>
              <p className="text-slate-600 leading-relaxed flex-1 mb-6">
                Reageer op opdrachten van opdrachtgevers met flexibele inzetvormen.
              </p>
              <span className="inline-flex items-center text-[#4FA151] font-semibold group-hover:gap-3 transition-all gap-2">
                Meer informatie
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-[#FDFEFD] to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[#4FA151] font-semibold text-sm uppercase tracking-widest mb-3">Voordelen</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-10 tracking-tight">Waarom ArboMatcher?</h2>
              <div className="space-y-5">
                {[
                  { icon: Shield, text: 'BIG-verificatie van alle professionals' },
                  { icon: Lock, text: 'AVG-proof communicatie' },
                  { icon: Zap, text: 'Rechtstreeks contact tussen opdrachtgever en professional na matching' },
                  { icon: Globe, text: 'Landelijke dekking in alle 12 provincies' },
                  { icon: Award, text: 'Eén platform voor opdrachtgevers en professionals' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/80 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4FA151]/15 to-[#4FA151]/5 flex items-center justify-center flex-shrink-0 border border-[#4FA151]/10">
                      <item.icon className="w-6 h-6 text-[#4FA151]" strokeWidth={2} />
                    </div>
                    <p className="text-slate-700 text-lg font-medium pt-2">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F4FAF4] rounded-2xl border border-[#4FA151]/15 shadow-lg shadow-slate-200/30 p-8 lg:p-10 hover:shadow-xl hover:shadow-[#4FA151]/10 hover:border-[#4FA151]/25 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4FA151] to-[#3E8E45] flex items-center justify-center text-white shadow-lg shadow-[#4FA151]/25 mb-6">
                <FileText className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">
                Bekijk alle opdrachten
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Opdrachten zijn publiek zichtbaar. Maak een gratis account aan om te reageren of zelf opdrachten te plaatsen.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/opdrachten"
                  className="inline-flex items-center justify-center bg-[#0F172A] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#1E293B] transition shadow-lg shadow-slate-900/10"
                >
                  Bekijk opdrachten
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-[#4FA151] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#3E8E45] transition shadow-lg shadow-[#4FA151]/25"
                >
                  Gratis registreren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
