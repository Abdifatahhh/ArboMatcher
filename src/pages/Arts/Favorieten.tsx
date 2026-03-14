import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Job } from '../../lib/types';
import { getContractFormLabel, getRemoteTypeLabel } from '../../lib/opdrachtConstants';
import { Heart, MapPin, Clock, Building2, FileText } from 'lucide-react';

export default function ArtsFavorieten() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    const { data: favData } = await supabase
      .from('favorites')
      .select('ref_id')
      .eq('user_id', user.id)
      .eq('type', 'JOB');

    if (!favData || favData.length === 0) {
      setLoading(false);
      return;
    }

    const jobIds = favData.map(f => f.ref_id);
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .in('id', jobIds);

    setFavorites(jobs || []);
    setLoading(false);
  };

  const removeFavorite = async (jobId: string) => {
    if (!user) return;

    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('ref_id', jobId)
      .eq('type', 'JOB');

    setFavorites(prev => prev.filter(job => job.id !== jobId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">
          Favoriete opdrachten ({favorites.length})
        </h1>
        <p className="text-slate-500 mt-1">Opdrachten die u heeft opgeslagen</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Geen favorieten</h3>
          <p className="text-slate-500 mb-6">
            Klik op het hartje bij een opdracht om deze op te slaan
          </p>
          <Link
            to="/professional/opdrachten"
            className="inline-block bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
          >
            Bekijk opdrachten
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition relative"
            >
              <button
                onClick={() => removeFavorite(job.id)}
                className="absolute top-4 right-4 p-1 text-red-500 hover:text-red-600 transition"
                title="Verwijder uit favorieten"
              >
                <Heart className="w-5 h-5 fill-red-500" />
              </button>

              <div className="mb-4">
                {(job as { job_tier?: string }).job_tier === 'PRO' ? (
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-400 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-3">
                    PRO
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xs mb-3">
                    {job.company_name?.slice(0, 2).toUpperCase() || 'OP'}
                  </div>
                )}
                <Link to={`/opdrachten/${job.id}`}>
                  <h3 className="font-bold text-[#0F172A] hover:text-[#0F172A] transition line-clamp-2 pr-6">
                    {job.title}
                  </h3>
                </Link>
              </div>

              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <span className="truncate">{getContractFormLabel(job.job_type) || '—'}</span>
                </div>
                {job.region && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span className="truncate">{job.region}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <span className="truncate">{getRemoteTypeLabel(job.remote_type) || '—'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <span>{new Date(job.created_at).toLocaleDateString('nl-NL')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
