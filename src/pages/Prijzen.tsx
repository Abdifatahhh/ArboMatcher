import { Link } from 'react-router-dom';
import { AuthLink } from '../components/AuthLink';
import { Check, X } from 'lucide-react';

export default function Prijzen() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Prijzen</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kies het abonnement dat bij uw behoeften past. Geen verborgen kosten.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">Voor organisaties</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">€49</span>
                <span className="text-gray-600">/maand</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mb-8 border border-slate-100">
                <div className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                  <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-[#0F172A] font-medium">1 actieve opdracht</span>
                </div>
                <div className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                  <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-[#0F172A] font-medium">Maximaal 10 reacties per maand</span>
                </div>
                <div className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                  <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-[#0F172A] font-medium">Basisfilters professionalslijst</span>
                </div>
                <div className="flex items-start bg-slate-50 rounded-lg px-3 py-2.5">
                  <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Direct messaging</span>
                </div>
                <div className="flex items-start bg-slate-50 rounded-lg px-3 py-2.5">
                  <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Professionals uitnodigen</span>
                </div>
              </div>
              <AuthLink
                to="/register"
                className="block w-full bg-gray-200 text-[#0F172A] text-center py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Start met Basic
              </AuthLink>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border-2 border-[#0F172A] p-8 relative">
              <div className="absolute top-0 right-0 bg-[#0F172A] text-white px-4 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                Populair
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">€149</span>
                <span className="text-gray-600">/maand</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mb-8 border border-slate-100">
                {['5 actieve opdrachten', 'Onbeperkt reacties', 'Volledige professionalslijst', 'Direct messaging', 'Professionals uitnodigen'].map((t) => (
                  <div key={t} className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                    <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#0F172A] font-medium">{t}</span>
                  </div>
                ))}
              </div>
              <AuthLink
                to="/register"
                className="block w-full bg-[#0F172A] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Start met Pro
              </AuthLink>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">Op maat</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mb-8 border border-slate-100">
                {['Onbeperkt opdrachten', 'Alle Pro functies', 'Dedicated support', 'Custom SLA', 'API toegang'].map((t) => (
                  <div key={t} className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                    <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#0F172A] font-medium">{t}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/contact"
                className="block w-full bg-[#0F172A] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#1e293b] transition"
              >
                Neem contact op
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">Voor professionals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Gratis kennismaken</h3>
              <p className="text-sm text-gray-500 mb-4">
                Voor professionals die eerst kennis willen maken met het platform.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F172A]">Gratis</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mb-8 border border-slate-100">
                {['Direct toegang tot een selectie van opdrachten', 'Beperkt aantal reacties per week'].map((t) => (
                  <div key={t} className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                    <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#0F172A] font-medium">{t}</span>
                  </div>
                ))}
              </div>
              <AuthLink
                to="/register"
                className="block w-full border border-gray-300 text-[#0F172A] text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Start gratis
              </AuthLink>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border-2 border-[#0F172A] p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#0F172A] text-white text-sm px-4 py-1 rounded-full">
                  Meest gekozen
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 mt-2">Freelance PRO Smart</h3>
              <p className="text-sm text-gray-500 mb-4">
                Voor professionals die direct willen reageren en de mooiste opdrachten willen scoren.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F172A]">&#8364; 159</span>
                <span className="text-gray-600"> per jaar</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mb-8 border border-slate-100">
                {['Direct toegang tot alle opdrachten', 'Onbeperkt reageren op opdrachten', 'Onbeperkt zoekopdrachten opslaan', 'Bespaar 42% t.o.v. een Flex abonnement'].map((t) => (
                  <div key={t} className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                    <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#0F172A] font-medium">{t}</span>
                  </div>
                ))}
              </div>
              <AuthLink
                to="/register"
                className="block w-full bg-[#0F172A] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Ga verder
              </AuthLink>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Freelance PRO Flex</h3>
              <p className="text-sm text-gray-500 mb-4">
                Voor professionals die direct willen reageren en de vrijheid van een korter abonnement willen ervaren.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F172A]">&#8364; 69</span>
                <span className="text-gray-600"> per kwartaal</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mb-8 border border-slate-100">
                {['Direct toegang tot alle opdrachten', 'Onbeperkt reageren op opdrachten', 'Onbeperkt zoekopdrachten opslaan'].map((t) => (
                  <div key={t} className="flex items-start bg-white rounded-lg px-3 py-2.5 border border-slate-200 shadow-sm">
                    <Check className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#0F172A] font-medium">{t}</span>
                  </div>
                ))}
              </div>
              <AuthLink
                to="/register"
                className="block w-full bg-[#0F172A] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
              >
                Ga verder
              </AuthLink>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Veelgestelde vragen</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: 'Kan ik mijn abonnement tussentijds opzeggen?', a: 'Ja, u kunt uw abonnement op elk moment opzeggen. Het abonnement loopt dan tot het einde van de lopende maand.' },
              { q: 'Zijn er transactiekosten?', a: 'Nee, ArboMatcher rekent geen transactiekosten. U betaalt alleen uw maandelijkse abonnement.' },
              { q: 'Kan ik upgraden of downgraden?', a: 'Ja, u kunt op elk moment upgraden. Bij een upgrade betaalt u direct het verschil. Bij een downgrade gaat de wijziging in na de huidige maand.' },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl px-5 py-4 border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-[#0F172A] mb-1.5">{item.q}</h3>
                <p className="text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
