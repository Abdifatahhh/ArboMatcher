import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Send, Paperclip, Smile, MapPin, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  sender_role: 'professional' | 'organisatie' | 'system';
  body: string;
  created_at: string;
}

interface Props {
  applicationId: string;
  jobTitle: string;
  companyName: string;
  contactName?: string;
  jobStatus?: string;
  statusChangedAt?: string | null;
  currentStatus?: string;
}

export default function ApplicationChat({ applicationId, jobTitle, companyName, contactName, jobStatus, statusChangedAt, currentStatus }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isDemo = applicationId.startsWith('demo-');

  useEffect(() => {
    if (isDemo) {
      setMessages([]);
      return;
    }

    fetchMessages();
    const channel = supabase
      .channel(`app-messages-${applicationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'application_messages', filter: `application_id=eq.${applicationId}` },
        (payload) => { setMessages(prev => [...prev, payload.new as Message]); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [applicationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('application_messages')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    if (isDemo) {
      setMessages(prev => [...prev, {
        id: `local-${Date.now()}`,
        application_id: applicationId,
        sender_id: user.id,
        sender_role: 'professional',
        body: input.trim(),
        created_at: new Date().toISOString(),
      }]);
      setInput('');
      setSending(false);
      return;
    }
    setSending(true);
    await supabase.from('application_messages').insert({
      application_id: applicationId,
      sender_id: user.id,
      sender_role: 'professional',
      body: input.trim(),
    });
    setInput('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOpen = jobStatus === 'PUBLISHED';
  const initials = (contactName || companyName).slice(0, 2).toUpperCase();

  return (
    <div className="bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm border border-white/30">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{contactName || companyName}</h3>
            <p className="text-[11px] text-emerald-100 truncate mt-0.5">
              {jobTitle}
            </p>
          </div>
          <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold ${isOpen ? 'bg-white/20 text-white' : 'bg-red-400/30 text-white'}`}>
            {isOpen ? 'Open' : 'Gesloten'}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#f8faf9]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">Nog geen berichten</p>
            <p className="text-xs text-slate-300">Stuur een bericht om het gesprek te starten</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id || msg.sender_role === 'professional';
          const isSystem = msg.sender_role === 'system';
          const time = new Date(msg.created_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 max-w-[90%] text-center shadow-sm">
                  <p className="text-xs text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{
                    __html: msg.body.replace(/\*([^*]+)\*/g, '<em class="text-slate-400 not-italic">$1</em>').replace(/"([^"]+)"/g, '<strong class="text-slate-700">"$1"</strong>')
                  }} />
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold flex-shrink-0 mb-1">
                  {initials}
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? '' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  isMe
                    ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-br-sm shadow-md shadow-emerald-500/20'
                    : 'bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100'
                }`}>
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                </div>
                <p className={`text-[10px] mt-1.5 px-1 ${isMe ? 'text-right text-slate-400' : 'text-slate-400'}`}>
                  {time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 pl-4 pr-2 py-2 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-500/10 transition">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Typ een bericht..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none resize-none min-h-[28px] max-h-[100px] py-1"
          />
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition rounded-xl"><MapPin className="w-4 h-4" /></button>
            <button className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition rounded-xl"><Paperclip className="w-4 h-4" /></button>
            <button className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition rounded-xl"><Smile className="w-4 h-4" /></button>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition shadow-sm disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none ml-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
