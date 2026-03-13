import { MessageSquare } from 'lucide-react';

export default function ArtsInbox() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Berichten</h1>
      <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center">
        <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">Messaging komt binnenkort</h3>
        <p className="text-slate-500">De berichtenfunctie wordt momenteel ontwikkeld</p>
      </div>
    </div>
  );
}
