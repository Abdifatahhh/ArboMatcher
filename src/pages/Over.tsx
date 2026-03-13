import { Link } from 'react-router-dom';
import { AuthLink } from '../components/AuthLink';
import { Shield, Zap, Eye, Lock, ArrowRight, Building2 } from 'lucide-react';

export default function Over() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-[#4FA151]" />
            <span className="text-[#4FA151] font-semibold text-sm uppercase tracking-wider">Over ons</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Over ArboMatcher</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Het platform voor professionals.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Onze missie</h2>
          <p className="text-[#111827] leading-relaxed mb-4 text-lg">
            ArboMatcher is het professionele platform dat organisaties en professionals met elkaar verbindt.
            Wij geloven in transparantie, kwaliteit en snelheid binnen de arbeidsgezondheidszorg.
          </p>
          <p className="text-[#111827] leading-relaxed text-lg">
            Ons platform maakt het eenvoudig voor arbodiensten, werkgevers en overheidsorganisaties
            om snel gekwalificeerde professionals te vinden voor ZZP, detachering of loondienst.
          </p>
        </section>

        <section className="mb-16">
          <div className="bg-[#F4FAF4] rounded-[16px] p-8 border border-[#4FA151]/15 shadow-lg shadow-slate-200/30">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Waar wij voor staan</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100">
                <div className="w-12 h-12 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#4FA151]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Kwaliteit</h3>
                <p className="text-slate-600">
                  Alle professionals worden geverifieerd via hun BIG-registratie. Zo garanderen we dat u werkt
                  met gecertificeerde professionals.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100">
                <div className="w-12 h-12 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#4FA151]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Snelheid</h3>
                <p className="text-slate-600">
                  Door ons efficiente matchingsysteem vindt u snel de juiste kandidaat.
                  95% match binnen 48 uur.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100">
                <div className="w-12 h-12 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-[#4FA151]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Transparantie</h3>
                <p className="text-slate-600">
                  Duidelijke profielen en eerlijke reviews. Na matching rechtstreeks contact tussen organisatie en professional.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100">
                <div className="w-12 h-12 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-[#4FA151]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Betrouwbaarheid</h3>
                <p className="text-slate-600">
                  AVG-proof communicatie en veilige gegevensuitwisseling volgens de hoogste standaarden.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Voor organisaties</h2>
          <p className="text-[#111827] leading-relaxed mb-6 text-lg">
            Of u nu een arbodienst, werkgever of overheidsorganisatie bent, ArboMatcher helpt u
            snel de juiste professional te vinden voor ZZP, detachering of loondienst.
          </p>
          <ul className="space-y-3 text-[#111827] mb-6">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Toegang tot een netwerk van 350+ geverifieerde professionals</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Direct contact met kandidaten zonder tussenpersonen</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>ZZP, detachering en loondienst via één platform</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Landelijke dekking in alle 12 provincies</span>
            </li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Voor professionals</h2>
          <p className="text-[#111827] leading-relaxed mb-6 text-lg">
            Als bedrijfsarts of arbo-professional biedt ArboMatcher u een professioneel platform
            om interessante opdrachten te vinden. Beheer uw beschikbaarheid en reageer
            op opdrachten die bij u passen.
          </p>
          <ul className="space-y-3 text-[#111827]">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Overzichtelijk platform met relevante opdrachten</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>BIG-verificatie geeft organisaties vertrouwen</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Zelf uw beschikbaarheid bepalen</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4FA151] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Gratis registratie, geen verborgen kosten</span>
            </li>
          </ul>
        </section>

        <section className="bg-[#F4FAF4] rounded-2xl border border-[#4FA151]/15 shadow-lg shadow-slate-200/30 p-8 hover:shadow-[#4FA151]/10 hover:border-[#4FA151]/25 transition-all duration-300 text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Sluit je aan bij ArboMatcher</h2>
          <p className="text-slate-600 mb-6">
            Het platform voor professionals.
          </p>
          <AuthLink
            to="/register"
            className="inline-flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
          >
            Gratis registreren
            <ArrowRight className="w-4 h-4 ml-2" />
          </AuthLink>
        </section>
      </div>
    </div>
  );
}
