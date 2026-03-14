import { MessageSquare } from 'lucide-react';

export default function OpdrachtgeverInbox() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Berichten</h1>
      <div className="bg-white p-12 rounded-lg shadow-lg text-center">
        <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Messaging komt binnenkort</h3>
        <p className="text-slate-600">De berichtenfunctie wordt momenteel ontwikkeld</p>
      </div>
    </div>
  );
}
