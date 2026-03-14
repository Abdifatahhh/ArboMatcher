import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLink } from '../components/AuthLink';
import { supabase } from '../lib/supabase';
import type { Job } from '../lib/types';
import { Search, MapPin, Briefcase, Calendar, ChevronDown, ChevronLeft, ChevronRight, X, CheckCircle, ArrowRight, Home, Users, Building2, Clock } from 'lucide-react';
import { CONTRACT_FORM_OPTIONS, REMOTE_TYPE_OPTIONS, getContractFormLabel, getRemoteTypeLabel } from '../lib/opdrachtConstants';

const isDev = import.meta.env.DEV;

const expertiseOptions = [
  { value: 'bedrijfsarts', label: 'Bedrijfsarts' },
  { value: 'arbo-arts', label: 'Arbo-arts' },
  { value: 'verzekeringsarts', label: 'Verzekeringsarts' },
  { value: 'pob', label: 'POB' },
  { value: 'casemanager-verzuim', label: 'Casemanager verzuim' },
];

const locationOptions = REMOTE_TYPE_OPTIONS;

export default function Opdrachten() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filters, setFilters] = useState({
    expertise: [] as string[],
    location: [] as string[],
    contractvorm: [] as string[],
  });
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 15;
  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const paginatedJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    fetchJobs();
  }, [filters, searchTerm, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm, sortOrder]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: sortOrder === 'oldest' });

    if (filters.location.length > 0) {
      query = query.in('remote_type', filters.location);
    }
    if (filters.contractvorm.length > 0) {
      query = query.in('job_type', filters.contractvorm);
    }
    if (filters.expertise.length > 0) {
      query = query.or(filters.expertise.map(e => `title.ilike.%${e}%,description.ilike.%${e}%`).join(','));
    }
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    let allJobs: Job[] = [...(data || [])];

    if (isDev) {
      const { fakeJobs } = await import('../data/fakeJobs');
      let filteredFakeJobs = [...fakeJobs];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredFakeJobs = filteredFakeJobs.filter(job =>
          job.title?.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term) ||
          job.region?.toLowerCase().includes(term)
        );
      }
      if (filters.location.length > 0) {
        filteredFakeJobs = filteredFakeJobs.filter(job => filters.location.includes(job.remote_type));
      }
      if (filters.contractvorm.length > 0) {
        filteredFakeJobs = filteredFakeJobs.filter(job => filters.contractvorm.includes(job.job_type));
      }
      if (filters.expertise.length > 0) {
        filteredFakeJobs = filteredFakeJobs.filter(job => filters.expertise.includes(job.expertise));
      }
      allJobs = [...allJobs, ...filteredFakeJobs] as Job[];
    }

    if (sortOrder === 'newest') {
      allJobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      allJobs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    if (error) {
      setError(error.message);
    } else {
      setJobs(allJobs);
    }
    setLoading(false);
  };

  const clearAllFilters = () => {
    setFilters({
      expertise: [],
      location: [],
      contractvorm: [],
    });
    setSearchTerm('');
  };

  const toggleFilter = (category: 'expertise' | 'location' | 'contractvorm', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const hasActiveFilters =
    filters.expertise.length > 0 ||
    filters.location.length > 0 ||
    filters.contractvorm.length > 0 ||
    searchTerm !== '';

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition flex items-center gap-1" aria-label="Terug naar home">
              <Home className="w-4 h-4" />
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Opdrachten</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-slate-400" />
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Vacatures</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4"><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Opdrachten</span></h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Bekijk alle beschikbare opdrachten voor bedrijfsartsen en arbo-professionals.
            Of het nu gaat om ZZP, detachering of loondienst – zoek in onze actuele opdrachten en ga aan de slag.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-lg shadow-slate-200/30 hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">De juiste professional vinden?</h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600"><span className="font-semibold text-[#0F172A]">Persoonlijke hulp</span> bij opdrachtplaatsing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600">Binnen <span className="font-semibold text-[#0F172A]">48 uur</span> de juiste match</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600">Geheel <span className="font-semibold text-[#0F172A]">onafhankelijk</span></span>
              </div>
              <AuthLink
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20 w-full sm:w-auto sm:ml-auto justify-center"
              >
                Plaats uw eerste opdracht gratis
                <ArrowRight className="w-4 h-4" />
              </AuthLink>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 order-2 lg:order-1">
            {error && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                Kon niet alle opdrachten laden: {error}. Toon alleen beschikbare resultaten.
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 font-medium">{jobs.length} opdracht{jobs.length !== 1 ? 'en' : ''} <span className="text-slate-400">· pagina {page}/{totalPages}</span></p>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  aria-label="Sorteer opdrachten"
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer shadow-sm"
                >
                  <option value="newest">Nieuwste eerst</option>
                  <option value="oldest">Oudste eerst</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition">
                    "{searchTerm}" <X className="w-3 h-3" />
                  </button>
                )}
                {filters.expertise.map(v => {
                  const label = expertiseOptions.find(o => o.value === v)?.label || v;
                  return (
                    <button key={v} onClick={() => toggleFilter('expertise', v)} className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition">
                      {label} <X className="w-3 h-3" />
                    </button>
                  );
                })}
                {filters.location.map(v => {
                  const label = locationOptions.find(o => o.value === v)?.label || v;
                  return (
                    <button key={v} onClick={() => toggleFilter('location', v)} className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition">
                      {label} <X className="w-3 h-3" />
                    </button>
                  );
                })}
                {filters.contractvorm.map(v => {
                  const label = CONTRACT_FORM_OPTIONS.find(o => o.value === v)?.label || v;
                  return (
                    <button key={v} onClick={() => toggleFilter('contractvorm', v)} className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition">
                      {label} <X className="w-3 h-3" />
                    </button>
                  );
                })}
                <button onClick={clearAllFilters} className="text-xs text-slate-500 hover:text-[#0F172A] font-medium ml-1 transition">
                  Alles wissen
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Geen opdrachten gevonden</h3>
                <p className="text-slate-500">Probeer andere filters of kom later terug</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                {paginatedJobs.map((job) => {
                  const desc = (job as { description?: string }).description || '';
                  const snippet = desc.length > 120 ? desc.slice(0, 120).trim() + '...' : desc;
                  return (
                  <Link
                    key={job.id}
                    to={`/opdrachten/${job.id}`}
                    className="block bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#0F172A] transition line-clamp-1">
                          {job.title}
                        </h3>
                        <span className="flex items-center gap-1.5 text-[#0F172A] font-medium text-sm whitespace-nowrap flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          Bekijk
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>

                      {snippet && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">{snippet}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        {job.region && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <MapPin className="w-3 h-3" />
                            {job.region}
                          </span>
                        )}
                        {job.job_type && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Briefcase className="w-3 h-3" />
                            {getContractFormLabel(job.job_type)}
                          </span>
                        )}
                        {(job as { remote_type?: string }).remote_type && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Building2 className="w-3 h-3" />
                            {getRemoteTypeLabel((job as { remote_type?: string }).remote_type)}
                          </span>
                        )}
                        {(job as { hours_per_week?: number }).hours_per_week && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Clock className="w-3 h-3" />
                            {(job as { hours_per_week?: number }).hours_per_week} uur/week
                          </span>
                        )}

                        <span className="ml-auto text-xs text-slate-400 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {(job as { applicants_count?: number }).applicants_count ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(job.created_at)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                  );
                })}

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`min-w-[2.5rem] py-2 px-3 rounded-lg text-sm font-medium transition ${
                          p === page
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </nav>
                )}

                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-lg shadow-slate-200/30 mt-8">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                    Reageren op deze opdracht?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Registreer gratis om te reageren op opdrachten.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <AuthLink
                      to="/login"
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
                    >
                      Inloggen
                    </AuthLink>
                    <AuthLink
                      to="/register"
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
                    >
                      Gratis registreren
                    </AuthLink>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 order-1 lg:order-2">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#0F172A]">Zoekfilter</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-slate-500 hover:text-[#0F172A] font-medium transition"
                  >
                    Wissen
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Zoekterm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Zoekterm(en)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 outline-none transition"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Expertisegebied</label>
                  <div className="space-y-2.5">
                    {expertiseOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.expertise.includes(option.value)}
                          onChange={() => toggleFilter('expertise', option.value)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-slate-900"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-[#0F172A] transition">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Werklocatie</label>
                  <div className="space-y-2.5">
                    {locationOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(option.value)}
                          onChange={() => toggleFilter('location', option.value)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-slate-900"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-[#0F172A] transition">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contractvorm</label>
                  <div className="space-y-2.5">
                    {CONTRACT_FORM_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.contractvorm.includes(option.value)}
                          onChange={() => toggleFilter('contractvorm', option.value)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-slate-900"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-[#0F172A] transition">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => fetchJobs()}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
                >
                  Filters toepassen
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
