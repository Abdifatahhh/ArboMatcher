import { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLink } from '../components/AuthLink';
import {
  Search,
  CheckCircle,
  Shield,
  ArrowRight,
  Building2,
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

const HowItWorksSectionOpdrachtgevers = lazy(() => import('../components/home/HowItWorksSectionOpdrachtgevers').then(m => ({ default: m.HowItWorksSectionOpdrachtgevers })));
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBelowFold, setShowBelowFold] = useState(false);
  useEffect(() => {
    const id = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(() => setShowBelowFold(true), { timeout: 400 })
      : setTimeout(() => setShowBelowFold(true), 100);
    return () => (typeof cancelIdleCallback !== 'undefined' ? cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    navigate(`/opdrachten?${params.toString()}`);
  };

  return (
    <div className="font-['Inter']">
      <section className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden [contain:layout]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1E293B]/50 rounded-full blur-3xl" />
          <svg className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03]" width="700" height="700" viewBox="0 0 700 700">
            <circle cx="350" cy="350" r="200" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="350" cy="350" r="280" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="350" cy="350" r="120" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M350 70 L350 630 M70 350 L630 350" stroke="currentColor" strokeWidth="1" />
            <circle cx="350" cy="150" r="8" fill="white" opacity="0.3" />
            <circle cx="550" cy="350" r="8" fill="white" opacity="0.3" />
            <circle cx="350" cy="550" r="8" fill="white" opacity="0.3" />
            <circle cx="150" cy="350" r="8" fill="white" opacity="0.3" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">Het platform voor de arbo-sector</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-[1.15] tracking-tight">
              Organisaties en professionals<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">efficiënt verbonden</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Eén platform voor het vinden van gekwalificeerde <span className="text-white font-medium">bedrijfsartsen</span> en <span className="text-white font-medium">arbo-professionals</span>. Flexibel inzetbaar, landelijk beschikbaar.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Zoek op specialisatie, regio of contractvorm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-0 focus:ring-2 focus:ring-emerald-400 text-slate-900 placeholder:text-slate-400 text-base sm:text-lg shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-green-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all whitespace-nowrap text-base sm:text-lg shadow-lg shadow-emerald-500/25"
              >
                Zoek opdrachten
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8 text-sm">
            {[
              'Landelijke dekking',
              'BIG-geregistreerde professionals',
              'Gratis registreren',
            ].map((label) => (
              <span key={label} className="flex items-center gap-2 text-slate-400/80">
                <CheckCircle className="w-4 h-4 text-emerald-400/70" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: '500+', label: 'Professionals' },
              { value: '95%', label: 'Match binnen 48u' },
              { value: '12', label: 'Provincies' },
              { value: '100%', label: 'BIG-geverifieerd' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[720px]" aria-hidden={!showBelowFold}>
        {showBelowFold && (
          <Suspense fallback={null}>
            <HowItWorksSectionOpdrachtgevers />
            <HowItWorksSection />
          </Suspense>
        )}
      </div>

      <section className="py-12 sm:py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 border border-slate-200">
              <span className="text-sm text-slate-600 font-medium">Snel aan de slag</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">
              Hoe ArboMatcher{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">werkt</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Van registratie tot samenwerking in drie eenvoudige stappen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            {[
              { num: '01', icon: UserPlus, title: 'Registreer gratis', desc: 'Maak een account aan als professional, organisatie of bemiddelingspartner. Volledig gratis en zonder verplichtingen.', gradient: 'from-[#0F172A] to-slate-700' },
              { num: '02', icon: PenLine, title: 'Plaats of reageer', desc: 'Plaats een opdracht of reageer direct op beschikbare opdrachten die bij uw expertise passen.', gradient: 'from-emerald-600 to-emerald-500' },
              { num: '03', icon: Handshake, title: 'Start samenwerking', desc: 'Maak direct afspraken en start de samenwerking. ZZP, detachering of loondienst.', gradient: 'from-green-500 to-green-400' },
            ].map((step, i) => (
              <div key={step.num} className="relative flex flex-col">
                <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 h-full flex flex-col">
                  <div className={`h-1.5 bg-gradient-to-r ${step.gradient}`} />
                  <div className="p-5 sm:p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                        <step.icon className="w-7 h-7" strokeWidth={2} />
                      </div>
                      <span className="text-5xl sm:text-6xl font-bold text-slate-100/80">{step.num}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed flex-1">{step.desc}</p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-5 items-center z-10" aria-hidden="true">
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/40 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-1.5 mb-4">
              <span className="text-sm text-slate-600 font-medium">Doelgroep</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">
              Oplossingen voor{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">iedereen</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Of u nu organisatie of professional bent, ArboMatcher biedt de juiste oplossing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <Link
              to="/oplossingen"
              className="group block relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 h-full"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#0F172A] to-slate-600" />
              <div className="p-6 sm:p-8 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Voor organisaties</h3>
                <p className="text-slate-500 leading-relaxed flex-1 mb-6">
                  Direct toegang tot een netwerk van ervaren bedrijfsartsen voor verzuimbegeleiding, preventie en re-integratie.
                </p>
                <span className="inline-flex items-center text-emerald-600 font-semibold group-hover:gap-3 transition-all gap-2 text-sm">
                  Ontdek de mogelijkheden
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              to="/oplossingen"
              className="group block relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 h-full"
            >
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-400" />
              <div className="p-6 sm:p-8 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-5 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-7 h-7" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Voor professionals</h3>
                <p className="text-slate-500 leading-relaxed flex-1 mb-6">
                  Vind opdrachten die bij uw expertise passen. Reageer direct en start met flexibele inzetvormen.
                </p>
                <span className="inline-flex items-center text-emerald-600 font-semibold group-hover:gap-3 transition-all gap-2 text-sm">
                  Ontdek de mogelijkheden
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/60 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 border border-slate-200">
                <span className="text-sm text-slate-600 font-medium">Voordelen</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">
                Waarom{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">ArboMatcher</span>?
              </h2>
              <p className="text-slate-500 text-lg mb-8">Alles wat u nodig heeft op één platform</p>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'BIG-verificatie van alle professionals', desc: 'Elke professional wordt geverifieerd via het BIG-register' },
                  { icon: Lock, text: 'AVG-proof communicatie', desc: 'Veilige gegevensuitwisseling volgens de hoogste standaarden' },
                  { icon: Zap, text: 'Rechtstreeks contact na matching', desc: 'Direct afspraken maken, zonder tussenpersoon' },
                  { icon: Globe, text: 'Landelijke dekking', desc: 'Actief in alle 12 provincies van Nederland' },
                  { icon: Award, text: 'Eén platform, twee doelgroepen', desc: 'Voor zowel organisaties als professionals' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white rounded-xl px-4 py-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[#0F172A] font-semibold">{item.text}</p>
                      <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-400" />
              <div className="p-5 sm:p-8 lg:p-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-700 flex items-center justify-center text-white shadow-lg mb-6">
                  <FileText className="w-7 h-7" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                  Bekijk alle opdrachten
                </h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  Opdrachten zijn publiek zichtbaar. Maak een gratis account aan om te reageren of zelf opdrachten te plaatsen.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/opdrachten"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Bekijk opdrachten
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <AuthLink
                    to="/register"
                    className="inline-flex items-center justify-center border border-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition"
                  >
                    Gratis registreren
                  </AuthLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            Klaar om te starten?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Maak een gratis account aan en ontdek hoe ArboMatcher u kan helpen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <AuthLink
              to="/register"
              className="inline-flex items-center justify-center bg-white text-[#0F172A] px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition text-lg shadow-lg"
            >
              Gratis registreren
              <ArrowRight className="w-5 h-5 ml-2" />
            </AuthLink>
            <Link
              to="/opdrachten"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition text-lg"
            >
              Bekijk opdrachten
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
