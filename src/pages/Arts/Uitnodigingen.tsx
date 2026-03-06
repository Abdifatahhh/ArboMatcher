import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Invite, Job } from '../../lib/types';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

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

    const { data: doctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!doctor) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('invites')
      .select('*, jobs(*)')
      .eq('doctor_id', doctor.id)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Uitnodigingen</h1>

      {invites.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen uitnodigingen</h3>
          <p className="text-gray-600">U heeft nog geen uitnodigingen ontvangen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div key={invite.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Link
                    to={`/opdrachten/${invite.jobs.id}`}
                    className="text-xl font-bold text-[#0F172A] hover:underline mb-2 block"
                  >
                    {invite.jobs.title}
                  </Link>
                  <p className="text-gray-600 mb-2">{invite.jobs.description.substring(0, 150)}...</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  invite.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  invite.status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invite.status}
                </span>
              </div>

              {invite.message && (
                <div className="mb-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Bericht van opdrachtgever:</p>
                  <p className="text-gray-700">{invite.message}</p>
                </div>
              )}

              {invite.status === 'PENDING' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleResponse(invite.id, 'ACCEPTED')}
                    className="flex items-center bg-[#4FA151] text-white px-4 py-2 rounded-xl hover:bg-[#3E8E45] transition"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accepteren
                  </button>
                  <button
                    onClick={() => handleResponse(invite.id, 'DECLINED')}
                    className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
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
