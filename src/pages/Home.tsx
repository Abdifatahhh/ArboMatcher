import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle,
} from 'lucide-react';

const HowItWorksSectionOpdrachtgevers = lazy(() => import('../components/home/HowItWorksSectionOpdrachtgevers').then(m => ({ default: m.HowItWorksSectionOpdrachtgevers })));
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const ProfessionalsListSection = lazy(() => import('../components/home/ProfessionalsListSection').then(m => ({ default: m.ProfessionalsListSection })));
const HomeMarketingSections = lazy(() => import('../components/home/HomeMarketingSections').then(m => ({ default: m.HomeMarketingSections })));

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
      <section className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden min-h-[620px] sm:min-h-[680px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">Het platform voor de arbo-sector</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-[1.15] tracking-tight">
              Organisaties en professionals<br className="hidden sm:block" />
              {' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">efficiënt verbonden</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Eén platform voor het vinden van gekwalificeerde <span className="text-white font-medium">bedrijfsartsen</span> en <span className="text-white font-medium">arbo-professionals</span>. Flexibel inzetbaar, landelijk beschikbaar.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 min-h-[132px] sm:min-h-[80px]">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Bijv. bedrijfsarts, arbo-arts of casemanager verzuim"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 sm:h-16 pl-12 pr-4 bg-white rounded-xl border-0 focus:ring-2 focus:ring-emerald-400 text-slate-900 placeholder:text-slate-400 text-base sm:text-lg shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-green-400 text-white px-8 h-14 sm:h-16 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all whitespace-nowrap text-base sm:text-lg shadow-lg shadow-emerald-500/25"
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
            <ProfessionalsListSection />
            <HomeMarketingSections />
          </Suspense>
        )}
      </div>
    </div>
  );
}
