import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

const expertiseOptions: FilterOption[] = [
  { value: 'bedrijfsarts', label: 'Bedrijfsarts' },
  { value: 'arbo-arts', label: 'Arbo-arts' },
  { value: 'verzuim', label: 'Verzuim' },
  { value: 'preventie', label: 'Preventie' },
  { value: 'reintegratie', label: 'Re-integratie' },
];

const hoursOptions: FilterOption[] = [
  { value: '0-16', label: '0 - 16 uur' },
  { value: '16-24', label: '16 - 24 uur' },
  { value: '24-32', label: '24 - 32 uur' },
  { value: '32-40', label: '32 - 40 uur' },
  { value: '40+', label: '40+ uur' },
];

const locationOptions: FilterOption[] = REMOTE_TYPE_OPTIONS;

const postedByOptions: FilterOption[] = [
  { value: 'direct', label: 'Direct door organisatie' },
  { value: 'bureau', label: 'Via bureau' },
];

const contractOptions: FilterOption[] = CONTRACT_FORM_OPTIONS;

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
            ? 'bg-[#F0FDF4] border-[#4FA151] text-[#4FA151]'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
        }`}
      >
        <span>{label}</span>
        <span className={`flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-xs ${
          selected.length > 0 ? 'bg-[#4FA151] text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {selected.length}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                className="w-4 h-4 rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const COMPANY_COLORS: Record<string, string> = {
  'ArboNed': 'bg-[#E53935]',
  'Zorg & Zekerheid': 'bg-[#1E88E5]',
  'UWV Partner': 'bg-[#43A047]',
  'Vitaal Werkt': 'bg-[#FB8C00]',
  'Achmea Health': 'bg-[#5E35B1]',
  'GGZ Eindhoven': 'bg-[#00ACC1]',
  'Onderwijsgroep': 'bg-[#7CB342]',
  'CBR Nederland': 'bg-[#F4511E]',
  'Shell Health': 'bg-[#FFD600]',
  'ING Arbo': 'bg-[#FF6F00]',
  'Letselschade BV': 'bg-[#6D4C41]',
  'PostNL Health': 'bg-[#EF5350]',
  'Gemeente Amsterdam': 'bg-[#E53935]',
  'ABP Medisch': 'bg-[#1565C0]',
  'Albert Heijn HR': 'bg-[#2196F3]',
  'UMC Utrecht': 'bg-[#D32F2F]',
  'Interpolis': 'bg-[#FBC02D]',
  'Booking.com Health': 'bg-[#0277BD]',
  'BAM Bouw': 'bg-[#FF5722]',
  'Nationale Nederlanden': 'bg-[#FF8F00]',
  'Hotel Chains NL': 'bg-[#8E24AA]',
  'Ministerie BZK': 'bg-[#0D47A1]',
  'Werk Actief': 'bg-[#00897B]',
  'Gasunie Health': 'bg-[#FFA000]',
  'Philips Healthcare': 'bg-[#0288D1]',
  'DAS Rechtsbijstand': 'bg-[#303F9F]',
  'Caparis': 'bg-[#689F38]',
  'KLM Health': 'bg-[#00B0FF]',
  'Aegon Life': 'bg-[#F57C00]',
  'ArboTech': 'bg-[#7B1FA2]'
};

export default function ArtsOpdrachten() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    expertise: [] as string[],
    hours: [] as string[],
    location: [] as string[],
    postedBy: [] as string[],
    contract: [] as string[],
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, searchTags]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('status', 'PUBLISHED');

    if (filters.location.length > 0) {
      query = query.in('remote_type', filters.location);
    }
    if (filters.contract.length > 0) {
      query = query.in('job_type', filters.contract);
    }
    if (searchTags.length > 0) {
      const searchConditions = searchTags.map(tag =>
        `title.ilike.%${tag}%,description.ilike.%${tag}%`
      ).join(',');
      query = query.or(searchConditions);
    }

    query = query.order('created_at', { ascending: false });

    const { data, count } = await query;
    setJobs(data || []);
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

  const handleJobClick = (job: Job) => {
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
    setFilters({
      expertise: [],
      hours: [],
      location: [],
      postedBy: [],
      contract: [],
    });
    setSearchTags([]);
  };

  const hasActiveFilters =
    filters.expertise.length > 0 ||
    filters.hours.length > 0 ||
    filters.location.length > 0 ||
    filters.postedBy.length > 0 ||
    filters.contract.length > 0 ||
    searchTags.length > 0;

  const filteredJobs = jobs.filter(job => {
    const matchesFavorites = !showFavoritesOnly || favorites.includes(job.id);
    return matchesFavorites;
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0F172A]">Opdrachten</h1>
        <p className="text-sm text-gray-500 mt-1">{totalCount} beschikbare opdrachten</p>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap items-center gap-2 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#4FA151] focus-within:border-transparent min-h-[44px]">
            {searchTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F0FDF4] text-[#4FA151] rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  onClick={() => removeSearchTag(tag)}
                  className="hover:bg-[#4FA151] hover:text-white rounded-full p-0.5 transition"
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
              className="flex-1 min-w-[200px] outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Expertise gebieden"
          options={expertiseOptions}
          selected={filters.expertise}
          onChange={(values) => setFilters({ ...filters, expertise: values })}
        />
        <FilterDropdown
          label="Uren per week"
          options={hoursOptions}
          selected={filters.hours}
          onChange={(values) => setFilters({ ...filters, hours: values })}
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

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3" />
            <span>Wis alle filters</span>
          </button>
        )}

        <div className="flex-1" />

        <label className="flex items-center space-x-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#0F172A] focus:ring-[#0F172A]"
          />
          <span className="text-gray-600">Favorieten</span>
        </label>

        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition ${viewMode === 'grid' ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition ${viewMode === 'list' ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F172A]"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Geen opdrachten gevonden</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredJobs.map((job) => {
            const companyColor = job.company_name ? COMPANY_COLORS[job.company_name] || 'bg-[#F97316]' : 'bg-[#F97316]';

            return (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer transition-all hover:shadow-md hover:border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  {(job as { job_tier?: string }).job_tier === 'PRO' || (job as { is_pro?: boolean }).is_pro ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4FA151] to-[#3E8E45] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      PRO
                    </div>
                  ) : (
                    <div className={`w-12 h-12 ${companyColor} rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                      {job.company_name?.split(' ').slice(0, 2).map(w => w[0]).join('') || 'AM'}
                    </div>
                  )}
                  <button
                    onClick={(e) => toggleFavorite(e, job.id)}
                    className="p-1 transition text-gray-300 hover:text-[#4FA151]"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(job.id) ? 'fill-[#4FA151] text-[#4FA151]' : ''}`} />
                  </button>
                </div>

                <h3 className="font-semibold text-[#0F172A] mb-4 line-clamp-2 leading-tight">
                  {job.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-500">
                  {((job as { job_tier?: string }).job_tier === 'PRO' || (job as { is_pro?: boolean }).is_pro) && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-[#4FA151] font-medium">PRO opdracht</span>
                    </div>
                  )}
                  {job.region && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{job.region}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{getContractFormLabel(job.job_type) || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>{job.views_count || 0} keer bekeken</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span>{job.applications_count || 0} reacties ontvangen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(job.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredJobs.map((job) => {
            const companyColor = job.company_name ? COMPANY_COLORS[job.company_name] || 'bg-[#F97316]' : 'bg-[#F97316]';

            return (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer transition-all hover:shadow-md hover:border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {(job as { job_tier?: string }).job_tier === 'PRO' || (job as { is_pro?: boolean }).is_pro ? (
                      <div className="w-12 h-12 bg-gradient-to-br from-[#4FA151] to-[#3E8E45] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        PRO
                      </div>
                    ) : (
                      <div className={`w-12 h-12 ${companyColor} rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {job.company_name?.split(' ').slice(0, 2).map(w => w[0]).join('') || 'AM'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0F172A] truncate">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                      {((job as { job_tier?: string }).job_tier === 'PRO' || (job as { is_pro?: boolean }).is_pro) && (
                        <span className="text-[#4FA151] font-medium">PRO opdracht</span>
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
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(job.created_at)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(e, job.id)}
                    className="p-2 transition flex-shrink-0 text-gray-300 hover:text-[#4FA151]"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(job.id) ? 'fill-[#4FA151] text-[#4FA151]' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
