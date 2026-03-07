import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Application, Job } from '../../lib/types';
import { Send, Clock, MapPin, Building2 } from 'lucide-react';

interface ApplicationWithJob extends Application {
  jobs: Job;
}

export default function ArtsReacties() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    const { data: doctor } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!doctor) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('doctor_id', doctor.id)
      .order('created_at', { ascending: false });

    if (data) {
      setApplications(data as ApplicationWithJob[]);
    }

    setLoading(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return { text: 'Geaccepteerd', color: 'bg-green-100 text-green-800' };
      case 'REJECTED': return { text: 'Afgewezen', color: 'bg-red-100 text-red-800' };
      case 'SHORTLISTED': return { text: 'Shortlist', color: 'bg-blue-100 text-blue-800' };
      default: return { text: 'In behandeling', color: 'bg-amber-100 text-amber-800' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">
          Verstuurde reacties ({applications.length})
        </h1>
        <p className="text-gray-600 mt-1">Overzicht van al uw reacties op opdrachten</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
          <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nog geen reacties verstuurd</h3>
          <p className="text-gray-600 mb-6">Begin met reageren op opdrachten om hier uw reacties te zien</p>
          <Link
            to="/arts/opdrachten"
            className="inline-block bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
          >
            Bekijk opdrachten
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => {
            const status = getStatusLabel(application.status);
            return (
              <div key={application.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition overflow-hidden">
                <div className="p-4 lg:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      {(application.jobs as { job_tier?: string })?.job_tier === 'PRO' ? (
                        <div className="w-12 h-12 bg-[#4FA151] rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          PRO
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold text-xs flex-shrink-0">
                          {application.jobs?.company_name?.slice(0, 2).toUpperCase() || 'OP'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/opdrachten/${application.jobs.id}`}
                          className="font-bold text-[#0F172A] hover:text-[#4FA151] transition block truncate"
                        >
                          {application.jobs.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                          {application.jobs.region && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{application.jobs.region}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{application.jobs.remote_type || 'Onsite'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(application.created_at).toLocaleDateString('nl-NL')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.color}`}>
                      {status.text}
                    </span>
                  </div>

                  {application.message && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="text-gray-500 text-xs font-medium mb-1">Uw motivatie:</p>
                      <p className="text-gray-700 line-clamp-2">{application.message}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
