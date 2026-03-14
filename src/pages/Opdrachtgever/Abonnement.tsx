import { CheckCircle, CreditCard } from 'lucide-react';

export default function OpdrachtgeverAbonnement() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Abonnement</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Pro Abonnement</h2>
            <p className="text-3xl font-bold text-[#0F172A] mt-2">
              €149<span className="text-lg text-slate-600">/maand</span>
            </p>
          </div>
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            Actief
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">5 actieve opdrachten</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Onbeperkt reacties</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Volledige professionalslijst</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Direct messaging</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-slate-700 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Professionals uitnodigen</span>
          </li>
        </ul>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-[#0F172A] mb-4">Betalingsgegevens</h3>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-slate-500 mr-4" />
            <div>
              <p className="font-semibold text-slate-700">Betaalmethode</p>
              <p className="text-sm text-slate-600">Creditcard eindigend op 4242</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 pt-6">
          <button className="text-red-600 hover:underline">
            Abonnement opzeggen
          </button>
        </div>
      </div>
    </div>
  );
}
