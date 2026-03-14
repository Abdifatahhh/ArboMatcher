import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Job } from '../../lib/types';
import { getContractFormLabel, getRemoteTypeLabel } from '../../lib/opdrachtConstants';
import { Heart, MapPin, Clock, Building2, FileText, Eye, MessageSquare } from 'lucide-react';

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
        <h1 className="text-xl lg:text-2xl font-bold text-[#0F172A]">
          Favorieten ({favorites.length})
        </h1>
        <p className="text-slate-500 text-sm mt-1">Opdrachten die u heeft opgeslagen</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {favorites.map((job) => {
            const pro = (job as { job_tier?: string }).job_tier === 'PRO';
            return (
              <Link
                key={job.id}
                to={`/opdrachten/${job.id}`}
                className="group bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg hover:border-slate-300 transition overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    {pro ? (
                      <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-[11px] tracking-wide shadow-sm">
                        PRO
                      </div>
                    ) : job.company_name ? (
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-[11px] shadow-sm">
                        {job.company_name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); removeFavorite(job.id); }}
                      className="p-1 text-emerald-500 hover:text-emerald-600 transition"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                    {job.title}
                  </h3>

                  <div className="space-y-1.5 text-[13px] text-slate-500">
                    {pro && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-emerald-700 font-medium">PRO opdracht</span>
                      </div>
                    )}
                    {!pro && job.company_name && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{job.company_name}</span>
                      </div>
                    )}
                    {job.region && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{job.region}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{getContractFormLabel(job.job_type) || '—'}</span>
                    </div>

                    <div className="border-t border-slate-100 !mt-2.5 !mb-2" />

                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{(job as Record<string, unknown>).views_count as number || 0} keer bekeken</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{(job as Record<string, unknown>).applications_count as number || 0} reacties ontvangen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{new Date(job.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
