import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { Job, Employer } from '../../lib/types';
import { CONTRACT_FORM_OPTIONS, REMOTE_TYPE_OPTIONS, normalizeContractForm } from '../../lib/opdrachtConstants';
import { TARGET_PROFESSION_OPTIONS } from '../../lib/jobReviewTypes';
import { buildChecklist } from '../../services/jobScoringService';
import { submitJobForReview } from '../../services/jobReviewService';
import { runJobAIReview } from '../../services/jobAIReviewService';
import { JobQualityScoreCard } from '../../components/jobReview/JobQualityScoreCard';
import { JobReviewStatusBadge } from '../../components/jobReview/JobReviewStatusBadge';
import { Plus, Briefcase, Eye, Trash2, X, Save, Send, Sparkles } from 'lucide-react';

const defaultForm: Partial<Job> & { target_profession?: string } = {
  title: '',
  description: '',
  region: '',
  remote_type: 'ONSITE',
  job_type: 'ZZP',
  status: 'DRAFT',
  poster_type: 'DIRECT',
  on_behalf_of: '',
  contact_person: '',
  is_anonymous: false,
  target_profession: '',
};

export default function OpdrachtgeverOpdrachten() {
  const { user } = useAuth();
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Job> & { target_profession?: string }>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;

    const { data: emp } = await supabase
      .from('employers')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!emp) {
      setLoading(false);
      return;
    }
    setEmployer(emp as Employer);

    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', emp.id)
      .order('created_at', { ascending: false });

    if (data) setJobs(data as Job[]);
    setLoading(false);
  };

  const checklist = useMemo(
    () => buildChecklist(
      { ...formData, company_name: employer?.company_name },
      employer
    ),
    [formData, employer]
  );

  const handleSaveDraft = async () => {
    if (!user || !employer) {
      toast.error('Vul eerst uw bedrijfsprofiel in');
      return;
    }
    if (!formData.title?.trim() || !formData.description?.trim()) {
      toast.error('Titel en beschrijving zijn verplicht');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('jobs').insert({
      employer_id: employer.id,
      title: formData.title,
      description: formData.description,
      region: formData.region || null,
      remote_type: formData.remote_type as any,
      job_type: normalizeContractForm(formData.job_type),
      job_tier: (formData as { job_tier?: string }).job_tier ?? 'GRATIS',
      start_date: formData.start_date || null,
      duration_weeks: formData.duration_weeks || null,
      hours_per_week: formData.hours_per_week || null,
      rate_min: formData.rate_min || null,
      rate_max: formData.rate_max || null,
      status: 'DRAFT',
      review_status: 'draft',
      poster_type: 'DIRECT',
      on_behalf_of: null,
      contact_person: null,
      is_anonymous: false,
      company_name: employer.company_name,
      target_profession: (formData as { target_profession?: string }).target_profession || null,
    });

    if (error) {
      toast.error('Opslaan mislukt');
    } else {
      toast.success('Opgeslagen als concept.');
      setFormData(defaultForm);
      setShowForm(false);
      fetchJobs();
    }
    setSubmitting(false);
  };

  const handleSubmitForReview = async () => {
    if (!user || !employer) {
      toast.error('Vul eerst uw bedrijfsprofiel in');
      return;
    }
    if (!formData.title?.trim() || !formData.description?.trim()) {
      toast.error('Titel en beschrijving zijn verplicht');
      return;
    }

    setSubmitting(true);
    let jobId: string | null = null;

    const { data: inserted } = await supabase.from('jobs').insert({
      employer_id: employer.id,
      title: formData.title,
      description: formData.description,
      region: formData.region || null,
      remote_type: formData.remote_type as any,
      job_type: normalizeContractForm(formData.job_type),
      job_tier: (formData as { job_tier?: string }).job_tier ?? 'GRATIS',
      start_date: formData.start_date || null,
      duration_weeks: formData.duration_weeks || null,
      hours_per_week: formData.hours_per_week || null,
      rate_min: formData.rate_min || null,
      rate_max: formData.rate_max || null,
      status: 'DRAFT',
      review_status: 'draft',
      poster_type: 'DIRECT',
      company_name: employer.company_name,
      target_profession: (formData as { target_profession?: string }).target_profession || null,
    }).select('id').single();

    if (inserted) jobId = (inserted as { id: string }).id;
    if (!jobId) {
      toast.error('Aanmaken mislukt');
      setSubmitting(false);
      return;
    }

    const result = await submitJobForReview(jobId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Opdracht ingediend voor beoordeling.');
      setFormData(defaultForm);
      setShowForm(false);
      fetchJobs();
    }
    setSubmitting(false);
  };

  const handleImproveClick = async () => {
    const input = {
      title: formData.title ?? '',
      description: formData.description ?? '',
      region: formData.region ?? null,
      remote_type: formData.remote_type ?? null,
      job_type: formData.job_type ?? null,
      start_date: formData.start_date ?? null,
      duration_weeks: formData.duration_weeks ?? null,
      hours_per_week: formData.hours_per_week ?? null,
      rate_min: formData.rate_min ?? null,
      rate_max: formData.rate_max ?? null,
      target_profession: (formData as { target_profession?: string }).target_profession ?? null,
    };
    const res = await runJobAIReview(input);
    setAISuggestions(res.ai_improvements ?? []);
    setShowAIPanel(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Weet u zeker dat u deze opdracht wilt verwijderen?')) return;

    await supabase.from('jobs').delete().eq('id', jobId);
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0F172A]">Mijn Opdrachten</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition shadow-lg shadow-emerald-500/20"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Annuleren' : 'Nieuwe opdracht'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">Nieuwe opdracht plaatsen</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titel *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Bijv: Bedrijfsarts gezocht voor 3 maanden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Beschrijving *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Beschrijf de opdracht, vereisten en wat u zoekt..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Regio</label>
                <input
                  type="text"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Amsterdam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contractvorm</label>
                <select
                  value={normalizeContractForm(formData.job_type)}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {CONTRACT_FORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Werkwijze</label>
                <select
                  value={formData.remote_type || 'ONSITE'}
                  onChange={(e) => setFormData({ ...formData, remote_type: e.target.value as 'ONSITE' | 'HYBRID' | 'REMOTE' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {REMOTE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duur (weken)</label>
                <input
                  type="number"
                  value={formData.duration_weeks || ''}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Min. tarief (per uur)</label>
                <input
                  type="number"
                  value={formData.rate_min || ''}
                  onChange={(e) => setFormData({ ...formData, rate_min: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max. tarief (per uur)</label>
                <input
                  type="number"
                  value={formData.rate_max || ''}
                  onChange={(e) => setFormData({ ...formData, rate_max: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Startdatum</label>
                <input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Uren/week</label>
                <input
                  type="number"
                  value={formData.hours_per_week || ''}
                  onChange={(e) => setFormData({ ...formData, hours_per_week: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="32"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Type professional / doelgroep</label>
                <select
                  value={(formData as { target_profession?: string }).target_profession || ''}
                  onChange={(e) => setFormData({ ...formData, target_profession: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecteer...</option>
                  {TARGET_PROFESSION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <JobQualityScoreCard
                checklist={checklist}
                reviewStatus={null}
                onImproveClick={handleImproveClick}
              />
            </div>

            {showAIPanel && aiSuggestions.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI-advies om uw opdracht te verbeteren
                </p>
                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                  {aiSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <button type="button" onClick={() => setShowAIPanel(false)} className="mt-2 text-sm text-amber-700 hover:underline">Sluiten</button>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleSaveDraft}
                disabled={submitting}
                className="flex items-center justify-center bg-slate-100 text-slate-800 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {submitting ? 'Bezig...' : 'Opslaan als concept'}
              </button>
              <button
                onClick={handleSubmitForReview}
                disabled={submitting}
                className="flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-5 h-5 mr-2" />
                {submitting ? 'Bezig...' : 'Indienen voor beoordeling'}
              </button>
            </div>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Geen opdrachten</h3>
          <p className="text-slate-600">Plaats uw eerste opdracht om te beginnen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      to={`/opdrachten/${job.id}`}
                      className="text-xl font-bold text-[#0F172A] hover:underline"
                    >
                      {job.title}
                    </Link>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{job.description}</p>
                </div>
                {job.review_status ? (
                  <JobReviewStatusBadge status={job.review_status} />
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    job.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                    job.status === 'CLOSED' ? 'bg-slate-100 text-slate-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/opdrachten/${job.id}`}
                  className="flex items-center text-[#0F172A] hover:underline"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Bekijk
                </Link>
                <Link
                  to={`/organisatie/kandidaten?job=${job.id}`}
                  className="flex items-center text-[#0F172A] hover:underline"
                >
                  Kandidaten
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="flex items-center text-red-600 hover:underline"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
