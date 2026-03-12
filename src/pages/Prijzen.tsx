import { Link } from 'react-router-dom';
import { AuthLink } from '../components/AuthLink';
import { Check, X } from 'lucide-react';

export default function Prijzen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white py-16">
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
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">€49</span>
                <span className="text-gray-600">/maand</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 actieve opdracht</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Maximaal 10 reacties per maand</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Basisfilters artsenlijst</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500">Direct messaging</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500">Artsen uitnodigen</span>
                </li>
              </ul>
              <AuthLink
                to="/register"
                className="block w-full bg-gray-200 text-[#0F172A] text-center py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Start met Basic
              </AuthLink>
            </div>

            <div className="bg-white rounded-lg shadow-xl border-2 border-[#4FA151] p-8 relative">
              <div className="absolute top-0 right-0 bg-[#4FA151] text-white px-4 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                Populair
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">€149</span>
                <span className="text-gray-600">/maand</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">5 actieve opdrachten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Onbeperkt reacties</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Volledige artsenlijst</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Direct messaging</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Artsen uitnodigen</span>
                </li>
              </ul>
              <AuthLink
                to="/register"
                className="block w-full bg-[#4FA151] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
              >
                Start met Pro
              </AuthLink>
            </div>

            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">Op maat</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Onbeperkt opdrachten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Alle Pro functies</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Custom SLA</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">API toegang</span>
                </li>
              </ul>
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
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">Voor artsen</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Gratis kennismaken</h3>
              <p className="text-sm text-gray-500 mb-4">
                Voor artsen die eerst kennis willen maken met het platform.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F172A]">Gratis</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Direct toegang tot een selectie van opdrachten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Beperkt aantal reacties per week</span>
                </li>
              </ul>
              <AuthLink
                to="/register"
                className="block w-full border border-gray-300 text-[#0F172A] text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Start gratis
              </AuthLink>
            </div>

            <div className="bg-white rounded-lg shadow-xl border-2 border-[#4FA151] p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#4FA151] text-white text-sm px-4 py-1 rounded-full">
                  Meest gekozen
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 mt-2">Freelance PRO Smart</h3>
              <p className="text-sm text-gray-500 mb-4">
                Voor artsen die direct willen reageren en de mooiste opdrachten willen scoren.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F172A]">&#8364; 159</span>
                <span className="text-gray-600"> per jaar</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Direct toegang tot alle opdrachten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Onbeperkt reageren op opdrachten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Onbeperkt zoekopdrachten opslaan</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Bespaar 42% t.o.v. een Flex abonnement</span>
                </li>
              </ul>
              <AuthLink
                to="/register"
                className="block w-full bg-[#4FA151] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
              >
                Ga verder
              </AuthLink>
            </div>

            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Freelance PRO Flex</h3>
              <p className="text-sm text-gray-500 mb-4">
                Voor artsen die direct willen reageren en de vrijheid van een korter abonnement willen ervaren.
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F172A]">&#8364; 69</span>
                <span className="text-gray-600"> per kwartaal</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Direct toegang tot alle opdrachten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Onbeperkt reageren op opdrachten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#4FA151] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Onbeperkt zoekopdrachten opslaan</span>
                </li>
              </ul>
              <AuthLink
                to="/register"
                className="block w-full bg-[#4FA151] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
              >
                Ga verder
              </AuthLink>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Veelgestelde vragen</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="font-semibold text-[#0F172A] mb-2">Kan ik mijn abonnement tussentijds opzeggen?</h3>
              <p className="text-gray-700">
                Ja, u kunt uw abonnement op elk moment opzeggen. Het abonnement loopt dan tot het einde
                van de lopende maand.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A] mb-2">Zijn er transactiekosten?</h3>
              <p className="text-gray-700">
                Nee, ArboMatcher rekent geen transactiekosten. U betaalt alleen uw maandelijkse abonnement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A] mb-2">Kan ik upgraden of downgraden?</h3>
              <p className="text-gray-700">
                Ja, u kunt op elk moment upgraden. Bij een upgrade betaalt u direct het verschil.
                Bij een downgrade gaat de wijziging in na de huidige maand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
