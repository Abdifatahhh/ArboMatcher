import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Application, Doctor, Profile, Job } from '../../lib/types';
import { Users } from 'lucide-react';

interface ApplicationWithProfessional extends Application {
  professionals: Doctor & { profiles: Profile };
  jobs: Job;
}

export default function OpdrachtgeverKandidaten() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const [applications, setApplications] = useState<ApplicationWithProfessional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user, jobId]);

  const fetchApplications = async () => {
    if (!user) return;

    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!employer) {
      setLoading(false);
      return;
    }

    let query = supabase
      .from('applications')
      .select('*, professionals(*, profiles(*)), jobs(*)')
      .in('job_id',
        (await supabase.from('jobs').select('id').eq('employer_id', employer.id)).data?.map(j => j.id) || []
      );

    if (jobId) {
      query = query.eq('job_id', jobId);
    }

    const { data } = await query.order('created_at', { ascending: false });

    if (data) {
      setApplications(data as ApplicationWithProfessional[]);
    }

    setLoading(false);
  };

  const handleStatusUpdate = async (applicationId: string, status: 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED') => {
    await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);

    fetchApplications();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'SHORTLISTED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">Kandidaten</h1>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen kandidaten</h3>
          <p className="text-gray-600">Er hebben nog geen professionals gereageerd op uw opdrachten</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    to={`/professional/${application.professionals.id}`}
                    className="text-xl font-bold text-[#0F172A] hover:underline"
                  >
                    {application.professionals.profiles.full_name || 'Naam onbekend'}
                  </Link>
                  <p className="text-sm text-gray-600">
                    Voor: <Link to={`/opdrachten/${application.jobs.id}`} className="hover:underline">{application.jobs.title}</Link>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>

              {application.professionals.bio && (
                <p className="text-gray-700 mb-4">{application.professionals.bio.substring(0, 200)}...</p>
              )}

              {application.message && (
                <div className="mb-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Motivatie:</p>
                  <p className="text-gray-700">{application.message}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex gap-3">
                  {application.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'SHORTLISTED')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
                      >
                        Accepteren
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Afwijzen
                      </button>
                    </>
                  )}
                  <Link
                    to={`/professional/${application.professionals.id}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Bekijk profiel
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
