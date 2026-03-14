import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Invite, Job } from '../../lib/types';
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InviteWithJob extends Invite {
  jobs: Job;
}

export default function ArtsUitnodigingen() {
  const { user } = useAuth();
  const [invites, setInvites] = useState<InviteWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvites();
  }, [user]);

  const fetchInvites = async () => {
    if (!user) return;

    const { data: professional } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!professional) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('invites')
      .select('*, jobs(*)')
      .eq('professional_id', professional.id)
      .order('created_at', { ascending: false });

    if (data) {
      setInvites(data as InviteWithJob[]);
    }

    setLoading(false);
  };

  const handleResponse = async (inviteId: string, status: 'ACCEPTED' | 'DECLINED') => {
    await supabase
      .from('invites')
      .update({ status })
      .eq('id', inviteId);

    fetchInvites();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Uitnodigingen</h1>

      {invites.length === 0 ? (
        <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center">
          <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Geen uitnodigingen</h3>
          <p className="text-slate-500">U heeft nog geen uitnodigingen ontvangen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div key={invite.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Link
                    to={`/opdrachten/${invite.jobs.id}`}
                    className="text-xl font-bold text-[#0F172A] hover:underline mb-2 block"
                  >
                    {invite.jobs.title}
                  </Link>
                  <p className="text-slate-500 text-sm mb-2">{invite.jobs.description.substring(0, 150)}...</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3 h-3" />{new Date(invite.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  invite.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  invite.status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {invite.status === 'ACCEPTED' ? 'Geaccepteerd' :
                   invite.status === 'DECLINED' ? 'Afgewezen' : 'In afwachting'}
                </span>
              </div>

              {invite.message && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 font-semibold mb-2">Bericht van organisatie:</p>
                  <p className="text-slate-600">{invite.message}</p>
                </div>
              )}

              {invite.status === 'PENDING' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleResponse(invite.id, 'ACCEPTED')}
                    className="flex items-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accepteren
                  </button>
                  <button
                    onClick={() => handleResponse(invite.id, 'DECLINED')}
                    className="flex items-center bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Afwijzen
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
