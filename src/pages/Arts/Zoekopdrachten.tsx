import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Search } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  filters: {
    expertise: string[];
    hoursMin: number;
    hoursMax: number;
    location: string[];
    postedBy: string[];
    contract: string[];
  };
  search_tags: string[];
  notify_direct: boolean;
  notify_digest: boolean;
  created_at: string;
}

const FILTER_LABELS: Record<string, string> = {
  expertise: 'Expertise gebieden',
  contract: 'Contractvorm',
  location: 'Locaties',
  postedBy: 'Intermediair',
};

export default function Zoekopdrachten() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchSearches();
  }, [user]);

  const fetchSearches = async () => {
    const { data } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setSearches((data || []) as SavedSearch[]);
    setLoading(false);
  };

  const deleteSearch = async (id: string) => {
    await supabase.from('saved_searches').delete().eq('id', id);
    setSearches(prev => prev.filter(s => s.id !== id));
  };

  const openSearch = (s: SavedSearch) => {
    const params = new URLSearchParams();
    if (s.search_tags.length) params.set('tags', s.search_tags.join(','));
    if (s.filters.expertise.length) params.set('expertise', s.filters.expertise.join(','));
    if (s.filters.contract.length) params.set('contract', s.filters.contract.join(','));
    if (s.filters.location.length) params.set('location', s.filters.location.join(','));
    if (s.filters.postedBy.length) params.set('postedBy', s.filters.postedBy.join(','));
    if (s.filters.hoursMin > 0) params.set('hoursMin', String(s.filters.hoursMin));
    if (s.filters.hoursMax < 40) params.set('hoursMax', String(s.filters.hoursMax));
    navigate(`/professional/opdrachten?${params.toString()}`);
  };

  const countFilters = (s: SavedSearch) => {
    const f = s.filters;
    const rows: { label: string; count: number }[] = [
      { label: 'Zoekwoorden', count: s.search_tags.length },
      { label: 'Expertise gebieden', count: f.expertise?.length || 0 },
      { label: 'Contractvorm', count: f.contract?.length || 0 },
      { label: 'Uren per week', count: (f.hoursMin > 0 || f.hoursMax < 40) ? 1 : 0 },
      { label: 'Locaties', count: f.location?.length || 0 },
      { label: 'Intermediair', count: f.postedBy?.length || 0 },
    ];
    return rows;
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Mijn zoekopdrachten</h1>
        <Link
          to="/professional/opdrachten?newSearch=1"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-medium rounded-lg shadow-sm hover:from-emerald-700 hover:to-green-600 transition"
        >
          <Plus className="w-4 h-4" />
          Nieuwe zoekopdracht
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : searches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Search className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-500 mb-1">Geen zoekopdrachten</p>
          <p className="text-slate-400 text-sm">Sla een zoekopdracht op om automatisch gematcht te worden.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {searches.map((s) => {
            const rows = countFilters(s);
            const expanded = expandedId === s.id;
            return (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-md p-5">
                <h3 className="text-base font-bold text-slate-800 mb-3">{s.name}</h3>

                <div className="space-y-1.5 mb-4 text-sm">
                  <label className="flex items-center gap-2.5 text-slate-600">
                    <input type="checkbox" checked={s.notify_direct} readOnly className="w-4 h-4 rounded pointer-events-none" />
                    Directe e-mailnotificatie bij match
                  </label>
                  <label className="flex items-center gap-2.5 text-slate-600">
                    <input type="checkbox" checked={s.notify_digest} readOnly className="w-4 h-4 rounded pointer-events-none" />
                    Opnemen in verzamel e-mailnotificatie
                  </label>
                </div>

                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Opgeslagen filters</p>
                <div className="space-y-1 mb-4">
                  {rows.map(r => (
                    <div key={r.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{r.label}</span>
                      <span className={`min-w-[24px] h-6 flex items-center justify-center rounded-full text-xs font-bold ${r.count > 0 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {r.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => deleteSearch(s.id)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(s.id)}
                    className="px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                  >
                    Bekijk filters
                  </button>
                  <button
                    onClick={() => openSearch(s)}
                    className="ml-auto px-3.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg shadow-sm hover:from-emerald-700 hover:to-green-600 transition"
                  >
                    Open zoekopdracht
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {expandedId && (() => {
        const s = searches.find(x => x.id === expandedId);
        if (!s) return null;
        const f = s.filters;
        const hasSearch = s.search_tags.length > 0;
        const hasExpertise = f.expertise?.length > 0;
        const hasHours = f.hoursMin > 0 || f.hoursMax < 40;
        const hasLocations = f.location?.length > 0;
        const hasContract = f.contract?.length > 0;
        const hasPostedBy = f.postedBy?.length > 0;
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" style={{ marginLeft: 0 }} onClick={() => setExpandedId(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-slate-800 mb-5">{s.name}</h2>

              {hasSearch && (
                <>
                  <p className="text-sm font-medium text-slate-600 mb-2">Zoekwoorden</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {s.search_tags.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-slate-800 text-white text-xs rounded-full font-medium">{t}</span>
                    ))}
                  </div>
                </>
              )}

              {hasExpertise && (
                <>
                  <p className="text-sm font-medium text-slate-600 mb-2">Expertise gebieden</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.expertise.map(v => (
                      <span key={v} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{v}</span>
                    ))}
                  </div>
                </>
              )}

              {hasHours && (
                <>
                  <p className="text-sm font-medium text-slate-600 mb-2">Uren per week</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2.5 py-1 bg-slate-800 text-white text-xs rounded-full font-medium">{f.hoursMin} - {f.hoursMax} uur</span>
                  </div>
                </>
              )}

              {hasLocations && (
                <>
                  <p className="text-sm font-medium text-slate-600 mb-2">Locaties</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.location.map(v => (
                      <span key={v} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{v}</span>
                    ))}
                  </div>
                </>
              )}

              {hasContract && (
                <>
                  <p className="text-sm font-medium text-slate-600 mb-2">Contractvorm</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.contract.map(v => (
                      <span key={v} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{v}</span>
                    ))}
                  </div>
                </>
              )}

              {hasPostedBy && (
                <>
                  <p className="text-sm font-medium text-slate-600 mb-2">Intermediair</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.postedBy.map(v => (
                      <span key={v} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{v}</span>
                    ))}
                  </div>
                </>
              )}

              {!hasSearch && !hasExpertise && !hasHours && !hasLocations && !hasContract && !hasPostedBy && (
                <p className="text-sm text-slate-400 mb-4">Geen filters ingesteld</p>
              )}

              <div className="flex justify-center pt-3 border-t border-slate-100">
                <button onClick={() => setExpandedId(null)} className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Annuleren</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
