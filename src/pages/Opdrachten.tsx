import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Job } from '../lib/types';
import { Search, MapPin, Briefcase, Calendar, ChevronDown, ChevronLeft, ChevronRight, X, CheckCircle, ArrowRight, Home, Users } from 'lucide-react';
import { fakeJobs, type FakeJob } from '../data/fakeJobs';

const expertiseOptions = [
  { value: 'bedrijfsarts', label: 'Bedrijfsarts' },
  { value: 'verzekeringsarts', label: 'Verzekeringsarts' },
  { value: 'medisch-adviseur', label: 'Medisch adviseur' },
  { value: 'arbeid-gezondheid', label: 'Arbeid & gezondheid' },
];

const locationOptions = [
  { value: 'ONSITE', label: 'Op locatie' },
  { value: 'HYBRID', label: 'Hybride' },
  { value: 'REMOTE', label: 'Remote consult' },
];

type CombinedJob = Job | FakeJob;

export default function Opdrachten() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<CombinedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filters, setFilters] = useState({
    expertise: [] as string[],
    location: [] as string[],
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
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    let allJobs: CombinedJob[] = [...(data || [])];

    let filteredFakeJobs = [...fakeJobs];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredFakeJobs = filteredFakeJobs.filter(job =>
        job.title?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.region?.toLowerCase().includes(term)
      );
    }

    allJobs = [...allJobs, ...filteredFakeJobs];

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
    });
    setSearchTerm('');
  };

  const toggleFilter = (category: 'expertise' | 'location', value: string) => {
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
    searchTerm !== '';

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition flex items-center gap-1">
              <Home className="w-4 h-4" />
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Opdrachten</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-[#4FA151]" />
            <span className="text-[#4FA151] font-semibold text-sm uppercase tracking-wider">Vacatures</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Opdrachten</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Bekijk alle beschikbare opdrachten voor bedrijfsartsen en arbo-professionals.
            Of het nu gaat om freelance, interim of detachering – zoek in onze actuele opdrachten en ga aan de slag.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white rounded-t-3xl pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="bg-[#F4FAF4] rounded-2xl p-8 border border-[#4FA151]/15 shadow-lg shadow-slate-200/30 hover:shadow-[#4FA151]/10 hover:border-[#4FA151]/25 transition-all duration-300">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">De juiste professional vinden?</h2>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#4FA151] flex-shrink-0" />
                <span className="text-slate-600"><span className="font-semibold text-[#0F172A]">Persoonlijke hulp</span> bij opdracht plaatsing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#4FA151] flex-shrink-0" />
                <span className="text-slate-600">Binnen <span className="font-semibold text-[#0F172A]">48 uur</span> de juiste match</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#4FA151] flex-shrink-0" />
                <span className="text-slate-600">Geheel <span className="font-semibold text-[#0F172A]">onafhankelijk</span></span>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition ml-auto"
              >
                Plaats je eerste opdracht gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{jobs.length} opdrachten (pagina {page} van {totalPages})</p>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="appearance-none bg-white border border-gray-200 rounded-[12px] px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4FA151] cursor-pointer"
                >
                  <option value="newest">Nieuwste eerst</option>
                  <option value="oldest">Oudste eerst</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white p-12 rounded-[16px] shadow-sm text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen opdrachten gevonden</h3>
                <p className="text-gray-500">Probeer andere filters of kom later terug</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/opdrachten/${job.id}`}
                    className="block bg-white rounded-[16px] border border-gray-100 hover:border-[#4FA151]/30 hover:shadow-md transition group"
                  >
                    <div className="flex items-center px-6 py-5 gap-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-base font-semibold text-[#0F172A] group-hover:text-[#4FA151] transition truncate">
                          {job.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-6 sm:gap-8 text-sm text-gray-500 flex-shrink-0">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <MapPin className="w-4 h-4 text-[#4FA151] flex-shrink-0" />
                          <span className="truncate">{job.region || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-[50px]">
                          <Users className="w-4 h-4 text-[#0F172A] flex-shrink-0" />
                          <span>{(job as any).applicants_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-[90px]">
                          <Calendar className="w-4 h-4 text-[#0F172A] flex-shrink-0" />
                          <span>{formatDate(job.created_at)}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[#4FA151] font-medium text-sm whitespace-nowrap">
                          Bekijk
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            ? 'bg-[#4FA151] text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </nav>
                )}

                <div className="bg-[#F4FAF4] rounded-2xl p-8 border border-[#4FA151]/15 shadow-lg shadow-slate-200/30 mt-8">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                    Reageren op deze opdracht?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Registreer gratis om te reageren op opdrachten.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-[#0F172A] text-white rounded-xl font-semibold hover:bg-[#1E293B] transition"
                    >
                      Inloggen
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-3 bg-[#4FA151] text-white rounded-xl font-semibold hover:bg-[#3E8E45] transition"
                    >
                      Gratis registreren
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 order-1 lg:order-2">
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-[#0F172A]">Zoekfilter</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#4FA151] hover:text-[#3E8E45] font-medium"
                  >
                    Leegmaken
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zoekterm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoekterm(en)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-[12px] text-sm focus:ring-2 focus:ring-[#4FA151] focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Expertisegebied</label>
                  <div className="space-y-2">
                    {expertiseOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.expertise.includes(option.value)}
                          onChange={() => toggleFilter('expertise', option.value)}
                          className="w-4 h-4 rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Werklocatie</label>
                  <div className="space-y-2">
                    {locationOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(option.value)}
                          onChange={() => toggleFilter('location', option.value)}
                          className="w-4 h-4 rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => fetchJobs()}
                  className="w-full bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
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
