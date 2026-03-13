import { AuthLink } from '../components/AuthLink';
import { Shield, Zap, Eye, Lock, ArrowRight, Building2 } from 'lucide-react';

export default function Over() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Over ons</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Over ArboMatcher</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Het platform voor professionals.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Onze missie</h2>
          <p className="text-slate-800 leading-relaxed mb-4 text-lg">
            ArboMatcher is het professionele platform dat organisaties en professionals met elkaar verbindt.
            Wij geloven in transparantie, kwaliteit en snelheid binnen de arbeidsgezondheidszorg.
          </p>
          <p className="text-slate-800 leading-relaxed text-lg">
            Ons platform maakt het eenvoudig voor arbodiensten, werkgevers en overheidsorganisaties
            om snel gekwalificeerde professionals te vinden voor ZZP, detachering of loondienst.
          </p>
        </section>

        <section className="mb-16">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Waar wij voor staan</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: 'Kwaliteit', desc: 'Alle professionals worden geverifieerd via hun BIG-registratie. Zo garanderen we dat u werkt met gecertificeerde professionals.' },
                { icon: Zap, title: 'Snelheid', desc: 'Door ons efficiënte matchingsysteem vindt u snel de juiste kandidaat. 95% match binnen 48 uur.' },
                { icon: Eye, title: 'Transparantie', desc: 'Duidelijke profielen en eerlijke reviews. Na matching rechtstreeks contact tussen organisatie en professional.' },
                { icon: Lock, title: 'Betrouwbaarheid', desc: 'AVG-proof communicatie en veilige gegevensuitwisseling volgens de hoogste standaarden.' },
              ].map((item) => (
                <div key={item.title} className="p-8 rounded-2xl bg-white shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A] mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Voor organisaties</h2>
          <p className="text-slate-800 leading-relaxed mb-6 text-lg">
            Of u nu een arbodienst, werkgever of overheidsorganisatie bent, ArboMatcher helpt u
            snel de juiste professional te vinden voor ZZP, detachering of loondienst.
          </p>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 mb-6">
            {[
              'Toegang tot een netwerk van 350+ geverifieerde professionals',
              'Direct contact met kandidaten zonder tussenpersonen',
              'ZZP, detachering en loondienst via één platform',
              'Landelijke dekking in alle 12 provincies',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                <div className="w-6 h-6 bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#0F172A] font-medium">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Voor professionals</h2>
          <p className="text-slate-800 leading-relaxed mb-6 text-lg">
            Als bedrijfsarts of arbo-professional biedt ArboMatcher u een professioneel platform
            om interessante opdrachten te vinden. Beheer uw beschikbaarheid en reageer
            op opdrachten die bij u passen.
          </p>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            {[
              'Overzichtelijk platform met relevante opdrachten',
              'BIG-verificatie geeft organisaties vertrouwen',
              'Zelf uw beschikbaarheid bepalen',
              'Gratis registratie, geen verborgen kosten',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                <div className="w-6 h-6 bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#0F172A] font-medium">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Sluit u aan bij ArboMatcher</h2>
          <p className="text-slate-600 mb-6">
            Het platform voor professionals.
          </p>
          <AuthLink
            to="/register"
            className="inline-flex items-center bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
          >
            Gratis registreren
            <ArrowRight className="w-4 h-4 ml-2" />
          </AuthLink>
        </section>
      </div>
    </div>
  );
}
