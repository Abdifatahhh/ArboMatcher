import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Job } from '../../lib/types';
import { CONTRACT_FORM_OPTIONS, REMOTE_TYPE_OPTIONS, getContractFormLabel } from '../../lib/opdrachtConstants';
import {
  Search,
  ChevronDown,
  Heart,
  MapPin,
  FileText,
  Eye,
  MessageSquare,
  Clock,
  LayoutGrid,
  List,
  X,
  Building2,
  Bell
} from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

const expertiseOptions: FilterOption[] = [
  { value: 'bedrijfsarts', label: 'Bedrijfsarts' },
  { value: 'arbo-arts', label: 'Arbo-arts' },
  { value: 'verzekeringsarts', label: 'Verzekeringsarts' },
  { value: 'casemanager_verzuim', label: 'Casemanager verzuim' },
  { value: 'pob', label: 'POB (Praktijkondersteuner)' },
  { value: 'arbeidshygiene', label: 'Arbeidshygiëne' },
  { value: 'preventie', label: 'Preventie' },
  { value: 'reintegratie', label: 'Re-integratie' },
];


const locationOptions: FilterOption[] = [
  { value: 'Drenthe', label: 'Drenthe' },
  { value: 'Flevoland', label: 'Flevoland' },
  { value: 'Friesland', label: 'Friesland' },
  { value: 'Gelderland', label: 'Gelderland' },
  { value: 'Groningen', label: 'Groningen' },
  { value: 'Limburg', label: 'Limburg' },
  { value: 'Noord-Brabant', label: 'Noord-Brabant' },
  { value: 'Noord-Holland', label: 'Noord-Holland' },
  { value: 'Overijssel', label: 'Overijssel' },
  { value: 'Utrecht', label: 'Utrecht' },
  { value: 'Zeeland', label: 'Zeeland' },
  { value: 'Zuid-Holland', label: 'Zuid-Holland' },
];

const postedByOptions: FilterOption[] = [
  { value: 'direct', label: 'Direct door organisatie' },
  { value: 'bureau', label: 'Via bureau' },
];

const contractOptions: FilterOption[] = CONTRACT_FORM_OPTIONS;

type SortOption = 'newest' | 'oldest' | 'most_viewed' | 'most_applications';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Nieuwste eerst' },
  { value: 'oldest', label: 'Oudste eerst' },
  { value: 'most_viewed', label: 'Meest bekeken' },
  { value: 'most_applications', label: 'Meeste reacties' },
];

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition text-sm font-medium ${
          selected.length > 0
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <span>{label}</span>
        <span className={`flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-xs ${
          selected.length > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
        }`}>
          {selected.length}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                className="w-4 h-4 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-600">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function HoursRangeDropdown({ min, max, onMinChange, onMaxChange }: { min: number; max: number; onMinChange: (v: number) => void; onMaxChange: (v: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = min > 0 || max < 40;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition text-sm font-medium ${
          active ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <span>Uren per week</span>
        {active && <span className="bg-emerald-500 text-white text-xs px-1.5 rounded-full">{min}–{max}</span>}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Minimaal</label>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <input type="text" inputMode="numeric" value={min} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); onMinChange(v === '' ? 0 : Math.min(Number(v), 60)); }} className="w-full px-3 py-2 text-sm text-slate-700 outline-none [appearance:textfield]" />
                <span className="px-2 text-xs text-slate-400 bg-slate-50 py-2 border-l border-slate-200">uur</span>
              </div>
            </div>
            <span className="text-slate-300 mt-5">–</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Maximaal</label>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <input type="text" inputMode="numeric" value={max} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); onMaxChange(v === '' ? 0 : Math.max(Number(v), 0)); }} className="w-full px-3 py-2 text-sm text-slate-700 outline-none [appearance:textfield]" />
                <span className="px-2 text-xs text-slate-400 bg-slate-50 py-2 border-l border-slate-200">uur</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const COMPANY_COLORS: Record<string, string> = {
  'ArboNed': '#E53935',
  'Zorg & Zekerheid': '#1E88E5',
  'UWV Partner': '#43A047',
  'Vitaal Werkt': '#FB8C00',
  'Achmea Health': '#5E35B1',
  'GGZ Eindhoven': '#00ACC1',
  'Onderwijsgroep': '#7CB342',
  'CBR Nederland': '#F4511E',
  'Shell Health': '#FFD600',
  'ING Arbo': '#FF6F00',
  'Letselschade BV': '#6D4C41',
  'PostNL Health': '#EF5350',
  'Gemeente Amsterdam': '#E53935',
  'ABP Medisch': '#1565C0',
  'Albert Heijn HR': '#2196F3',
  'UMC Utrecht': '#D32F2F',
  'Interpolis': '#FBC02D',
  'Booking.com Health': '#0277BD',
  'BAM Bouw': '#FF5722',
  'Nationale Nederlanden': '#FF8F00',
  'Hotel Chains NL': '#8E24AA',
  'Ministerie BZK': '#0D47A1',
  'Werk Actief': '#00897B',
  'Gasunie Health': '#FFA000',
  'Philips Healthcare': '#0288D1',
  'DAS Rechtsbijstand': '#303F9F',
  'Caparis': '#689F38',
  'KLM Health': '#00B0FF',
  'Aegon Life': '#F57C00',
  'ArboTech': '#7B1FA2',
};

function getCompanyColor(companyName?: string | null): string {
  if (!companyName) return '#F97316';
  return COMPANY_COLORS[companyName] || '#F97316';
}

export default function ArtsOpdrachten() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState<string[]>(() => {
    const t = searchParams.get('tags');
    return t ? t.split(',').filter(Boolean) : [];
  });
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNotifyDirect, setSaveNotifyDirect] = useState(false);
  const [saveNotifyDigest, setSaveNotifyDigest] = useState(true);
  const [saving, setSaving] = useState(false);
  const showSaveSearchButton = searchParams.get('newSearch') === '1';

  const [filters, setFilters] = useState(() => {
    const arr = (key: string) => { const v = searchParams.get(key); return v ? v.split(',').filter(Boolean) : []; };
    return {
      expertise: arr('expertise'),
      hoursMin: Number(searchParams.get('hoursMin')) || 0,
      hoursMax: Number(searchParams.get('hoursMax')) || 40,
      location: arr('location'),
      postedBy: arr('postedBy'),
      contract: arr('contract'),
    };
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, searchTags, sortBy]);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    let query = supabase
      .from('jobs')
      .select('*, applications(count)', { count: 'exact' })
      .eq('status', 'PUBLISHED');

    if (filters.location.length > 0) {
      query = query.in('region', filters.location);
    }
    if (filters.contract.length > 0) {
      query = query.in('job_type', filters.contract);
    }
    if (filters.hoursMin > 0) {
      query = query.gte('hours_per_week', filters.hoursMin);
    }
    if (filters.hoursMax < 40) {
      query = query.lte('hours_per_week', filters.hoursMax);
    }
    if (searchTags.length > 0) {
      const searchConditions = searchTags.map(tag =>
        `title.ilike.%${tag}%,description.ilike.%${tag}%`
      ).join(',');
      query = query.or(searchConditions);
    }

    switch (sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'most_viewed':
        query = query.order('views_count', { ascending: false });
        break;
      case 'most_applications':
        query = query.order('applications_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, count } = await query;
    const enriched = (data || []).map((job: Record<string, unknown>) => {
      const appArr = job.applications as { count: number }[] | undefined;
      return { ...job, applications_count: appArr?.[0]?.count ?? job.applications_count ?? 0 };
    });
    setJobs(enriched as Job[]);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('ref_id')
      .eq('user_id', user.id)
      .eq('type', 'JOB');
    setFavorites(data?.map(f => f.ref_id) || []);
  };

  const toggleFavorite = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!user) return;

    if (favorites.includes(jobId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('ref_id', jobId)
        .eq('type', 'JOB');
      setFavorites(prev => prev.filter(id => id !== jobId));
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, ref_id: jobId, type: 'JOB' });
      setFavorites(prev => [...prev, jobId]);
    }
  };

  const handleSaveSearch = async () => {
    if (!user || !saveName.trim()) return;
    setSaving(true);
    await supabase.from('saved_searches').insert({
      user_id: user.id,
      name: saveName.trim(),
      filters,
      search_tags: searchTags,
      notify_direct: saveNotifyDirect,
      notify_digest: saveNotifyDigest,
    });
    setSaving(false);
    setShowSaveModal(false);
    setSaveName('');
  };

  const handleJobClick = (job: Job) => {
    supabase.rpc('increment_job_views', { p_job_id: job.id }).then();
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, views_count: (j.views_count || 0) + 1 } : j));
    navigate(`/opdrachten/${job.id}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && searchInput.trim()) {
      e.preventDefault();
      const newTag = searchInput.trim().replace(/,/g, '');
      if (newTag && !searchTags.includes(newTag)) {
        setSearchTags([...searchTags, newTag]);
      }
      setSearchInput('');
    }
  };

  const removeSearchTag = (tag: string) => {
    setSearchTags(searchTags.filter(t => t !== tag));
  };

  const clearAllFilters = () => {
    setFilters({ expertise: [], hoursMin: 0, hoursMax: 40, location: [], postedBy: [], contract: [] });
    setSearchTags([]);
  };

  const hasActiveFilters =
    filters.expertise.length > 0 ||
    filters.hoursMin > 0 || filters.hoursMax < 40 ||
    filters.location.length > 0 ||
    filters.postedBy.length > 0 ||
    filters.contract.length > 0 ||
    searchTags.length > 0;

  const filteredJobs = jobs.filter(job => {
    return !showFavoritesOnly || favorites.includes(job.id);
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isPro = (job: Job) =>
    (job as { job_tier?: string }).job_tier === 'PRO' || (job as { is_pro?: boolean }).is_pro;

  const isOlderThan48h = (date: string) => Date.now() - new Date(date).getTime() > 48 * 60 * 60 * 1000;
  const showCompany = (job: Job) => !isPro(job) || isOlderThan48h(job.created_at);

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Opdrachten <span className="text-slate-400 font-normal">({totalCount})</span>
        </h1>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <div className="flex flex-wrap items-center gap-2 pl-10 pr-4 py-2.5 bg-white border border-slate-200 shadow-sm rounded-lg focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-300 min-h-[44px]">
            {searchTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200"
              >
                {tag}
                <button
                  onClick={() => removeSearchTag(tag)}
                  className="hover:bg-emerald-500 hover:text-white rounded-full p-0.5 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={searchTags.length === 0 ? "Vul hier een functietitel of relevante trefwoorden in. Gebruik een komma of enter om woorden te scheiden." : ""}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 min-w-[200px] outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Expertise gebieden"
          options={expertiseOptions}
          selected={filters.expertise}
          onChange={(values) => setFilters({ ...filters, expertise: values })}
        />
        <HoursRangeDropdown
          min={filters.hoursMin}
          max={filters.hoursMax}
          onMinChange={(v) => setFilters({ ...filters, hoursMin: v })}
          onMaxChange={(v) => setFilters({ ...filters, hoursMax: v })}
        />
        <FilterDropdown
          label="Werklocatie"
          options={locationOptions}
          selected={filters.location}
          onChange={(values) => setFilters({ ...filters, location: values })}
        />
        <FilterDropdown
          label="Geplaatst door"
          options={postedByOptions}
          selected={filters.postedBy}
          onChange={(values) => setFilters({ ...filters, postedBy: values })}
        />
        <FilterDropdown
          label="Contractvorm"
          options={contractOptions}
          selected={filters.contract}
          onChange={(values) => setFilters({ ...filters, contract: values })}
        />

        {showSaveSearchButton && (
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-medium shadow-sm hover:from-emerald-700 hover:to-green-600 transition"
          >
            <Bell className="w-3.5 h-3.5" />
            Zoekopdracht opslaan
          </button>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-3 h-3" />
            <span>Wis filters</span>
          </button>
        )}
      </div>

      {/* Toolbar: favorites toggle, sort, view mode */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm select-none">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="w-4 h-4 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-slate-600">Toon alleen favorieten</span>
        </label>

        <div className="flex-1" />

        {/* Sort dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-slate-300 transition"
          >
            <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${sortBy === opt.value ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Geen opdrachten gevonden</p>
          <p className="text-sm text-slate-400 mt-1">Pas uw filters aan of probeer andere zoektermen</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredJobs.map((job) => {
            const pro = isPro(job);
            const canShowCompany = showCompany(job);
            const color = canShowCompany ? getCompanyColor(job.company_name) : '#059669';

            return (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="group bg-white rounded-xl border border-slate-200 shadow-md cursor-pointer transition-all hover:shadow-lg hover:border-slate-300 overflow-hidden"
              >

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    {pro ? (
                      <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-[11px] tracking-wide shadow-sm">
                        PRO
                      </div>
                    ) : canShowCompany && job.company_name ? (
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[11px] shadow-sm"
                        style={{ background: color }}
                      >
                        {job.company_name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(e, job.id)}
                      className="p-1 transition text-slate-300 hover:text-emerald-500"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(job.id) ? 'fill-emerald-500 text-emerald-500' : ''}`} />
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
                    {canShowCompany && job.company_name && (
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
                      <span>{job.views_count || 0} keer bekeken</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{job.applications_count || 0} reacties ontvangen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{formatDate(job.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {filteredJobs.map((job) => {
            const pro = isPro(job);
            const canShowCompany = showCompany(job);
            const color = canShowCompany ? getCompanyColor(job.company_name) : '#059669';

            return (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="group bg-white rounded-xl border border-slate-200 shadow-md cursor-pointer transition-all hover:shadow-lg hover:border-slate-300 overflow-hidden flex"
              >

                <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {pro ? (
                      <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-[11px] tracking-wide shadow-sm">
                        PRO
                      </div>
                    ) : canShowCompany && job.company_name ? (
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[11px] shadow-sm"
                        style={{ background: color }}
                      >
                        {job.company_name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[13px] text-slate-500">
                      {pro && (
                        <span className="text-emerald-700 font-medium">PRO opdracht</span>
                      )}
                      {canShowCompany && job.company_name && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {job.company_name}
                        </span>
                      )}
                      {job.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.region}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {getContractFormLabel(job.job_type) || '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {job.views_count || 0}x bekeken
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {job.applications_count || 0} reacties
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(job.created_at)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(e, job.id)}
                    className="p-2 transition flex-shrink-0 text-slate-300 hover:text-emerald-500"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(job.id) ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">Zoekopdracht opslaan</h2>

            <label className="block text-sm font-medium text-slate-600 mb-1.5">Naam van zoekopdracht</label>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Naam van zoekopdracht"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 mb-5"
            />

            <p className="text-sm font-medium text-slate-600 mb-2">Notificatie instellingen</p>
            <label className="flex items-center gap-3 mb-2 cursor-pointer">
              <input type="checkbox" checked={saveNotifyDirect} onChange={(e) => setSaveNotifyDirect(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-slate-600">Directe e-mailnotificatie bij match</span>
            </label>
            <label className="flex items-center gap-3 mb-5 cursor-pointer">
              <input type="checkbox" checked={saveNotifyDigest} onChange={(e) => setSaveNotifyDigest(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-slate-600">Opnemen in verzamel e-mailnotificatie</span>
            </label>

            <p className="text-sm font-medium text-slate-600 mb-2">Opgeslagen filters</p>
            <div className="space-y-1 mb-6">
              {searchTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {searchTags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-slate-800 text-white text-xs rounded-full font-medium">{t}</span>
                  ))}
                </div>
              )}
              {filters.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {filters.expertise.map(v => (
                    <span key={v} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{expertiseOptions.find(o => o.value === v)?.label || v}</span>
                  ))}
                </div>
              )}
              {filters.contract.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {filters.contract.map(v => (
                    <span key={v} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{contractOptions.find(o => o.value === v)?.label || v}</span>
                  ))}
                </div>
              )}
              {filters.location.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {filters.location.map(v => (
                    <span key={v} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">{v}</span>
                  ))}
                </div>
              )}
              {(filters.hoursMin > 0 || filters.hoursMax < 40) && (
                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200 mt-1">{filters.hoursMin}–{filters.hoursMax} uur/week</span>
              )}
              {!hasActiveFilters && searchTags.length === 0 && (
                <p className="text-sm text-slate-400">Geen filters ingesteld</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Annuleren</button>
              <button
                onClick={handleSaveSearch}
                disabled={!saveName.trim() || saving}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg shadow-sm hover:from-emerald-700 hover:to-green-600 transition disabled:opacity-50"
              >
                {saving ? 'Opslaan...' : 'Opslaan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
