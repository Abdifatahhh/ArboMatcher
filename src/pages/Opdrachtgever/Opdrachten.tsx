import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { Job } from '../../lib/types';
import { Plus, Briefcase, Eye, Trash2, X, Save, Building2 } from 'lucide-react';

export default function OpdrachtgeverOpdrachten() {
  const { user } = useAuth();
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    region: '',
    remote_type: 'ONSITE',
    job_type: 'TIJDELIJK',
    status: 'PUBLISHED',
    poster_type: 'DIRECT',
    on_behalf_of: '',
    contact_person: '',
    is_anonymous: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
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

    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employer.id)
      .order('created_at', { ascending: false });

    if (data) {
      setJobs(data);
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!employer) {
      toast.error('Vul eerst uw bedrijfsprofiel in');
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error('Titel en beschrijving zijn verplicht');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('jobs').insert({
      employer_id: employer.id,
      title: formData.title,
      description: formData.description,
      region: formData.region,
      remote_type: formData.remote_type as any,
      job_type: formData.job_type as any,
      job_tier: (formData as { job_tier?: string }).job_tier ?? 'STANDARD',
      start_date: formData.start_date || null,
      duration_weeks: formData.duration_weeks || null,
      hours_per_week: formData.hours_per_week || null,
      rate_min: formData.rate_min || null,
      rate_max: formData.rate_max || null,
      status: formData.status as any,
      poster_type: 'DIRECT',
      on_behalf_of: null,
      contact_person: null,
      is_anonymous: false
    });

    if (error) {
      toast.error('Er is een fout opgetreden');
    } else {
      toast.success('Opdracht aangemaakt.');
      setFormData({
        title: '',
        description: '',
        region: '',
        remote_type: 'ONSITE',
        job_type: 'TIJDELIJK',
        status: 'PUBLISHED',
        poster_type: 'DIRECT',
        on_behalf_of: '',
        contact_person: '',
        is_anonymous: false
      });
      setShowForm(false);
      fetchJobs();
    }

    setSubmitting(false);
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Weet u zeker dat u deze opdracht wilt verwijderen?')) return;

    await supabase.from('jobs').delete().eq('id', jobId);
    fetchJobs();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0F172A]">Mijn Opdrachten</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Bijv: Bedrijfsarts gezocht voor 3 maanden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beschrijving *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                placeholder="Beschrijf de opdracht, vereisten en wat u zoekt..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regio</label>
                <input
                  type="text"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="Amsterdam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type opdracht</label>
                <select
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                >
                  <option value="TIJDELIJK">Tijdelijk</option>
                  <option value="INTERIM">Interim</option>
                  <option value="VAST">Vast</option>
                  <option value="PROJECT">Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Werkwijze</label>
                <select
                  value={formData.remote_type}
                  onChange={(e) => setFormData({ ...formData, remote_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                >
                  <option value="ONSITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duur (weken)</label>
                <input
                  type="number"
                  value={formData.duration_weeks || ''}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min. tarief (per uur)</label>
                <input
                  type="number"
                  value={formData.rate_min || ''}
                  onChange={(e) => setFormData({ ...formData, rate_min: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max. tarief (per uur)</label>
                <input
                  type="number"
                  value={formData.rate_max || ''}
                  onChange={(e) => setFormData({ ...formData, rate_max: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startdatum</label>
                <input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uren/week</label>
                <input
                  type="number"
                  value={formData.hours_per_week || ''}
                  onChange={(e) => setFormData({ ...formData, hours_per_week: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="32"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full md:w-auto flex items-center justify-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {submitting ? 'Bezig...' : 'Opdracht plaatsen'}
            </button>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen opdrachten</h3>
          <p className="text-gray-600">Plaats uw eerste opdracht om te beginnen</p>
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
                  <p className="text-gray-600 line-clamp-2">{job.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  job.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                  job.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status}
                </span>
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
                  to={`/opdrachtgever/kandidaten?job=${job.id}`}
                  className="flex items-center text-[#4FA151] hover:underline"
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
