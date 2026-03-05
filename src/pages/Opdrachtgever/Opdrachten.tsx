import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Job, PosterType } from '../../lib/types';
import { Plus, Briefcase, Eye, Trash2, X, Save, Building2, Users } from 'lucide-react';

export default function OpdrachtgeverOpdrachten() {
  const { user } = useAuth();
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
      alert('Vul eerst uw bedrijfsprofiel in');
      return;
    }

    if (!formData.title || !formData.description) {
      alert('Titel en beschrijving zijn verplicht');
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
      start_date: formData.start_date || null,
      duration_weeks: formData.duration_weeks || null,
      hours_per_week: formData.hours_per_week || null,
      rate_min: formData.rate_min || null,
      rate_max: formData.rate_max || null,
      status: formData.status as any,
      poster_type: formData.poster_type,
      on_behalf_of: formData.poster_type === 'INTERMEDIARY' ? formData.on_behalf_of : null,
      contact_person: formData.poster_type === 'INTERMEDIARY' ? formData.contact_person : null,
      is_anonymous: formData.poster_type === 'INTERMEDIARY' ? formData.is_anonymous : false
    });

    if (error) {
      alert('Er is een fout opgetreden');
    } else {
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
          className="flex items-center bg-[#16A34A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#15803d] transition"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Annuleren' : 'Nieuwe opdracht'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">Nieuwe opdracht plaatsen</h2>

          <div className="mb-6 p-4 bg-[#F3F4F6] rounded-lg">
            <p className="text-sm font-medium text-[#0F172A] mb-4">Deze opdracht wordt geplaatst door:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                formData.poster_type === 'DIRECT'
                  ? 'border-[#4FA151] bg-[#4FA151]/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="poster_type"
                  value="DIRECT"
                  checked={formData.poster_type === 'DIRECT'}
                  onChange={() => setFormData({ ...formData, poster_type: 'DIRECT' as PosterType, on_behalf_of: '', contact_person: '', is_anonymous: false })}
                  className="sr-only"
                />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.poster_type === 'DIRECT' ? 'bg-[#4FA151]' : 'bg-gray-200'
                }`}>
                  <Building2 className={`w-5 h-5 ${formData.poster_type === 'DIRECT' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${formData.poster_type === 'DIRECT' ? 'text-[#0F172A]' : 'text-gray-700'}`}>
                    Directe opdrachtgever
                  </p>
                  <p className="text-sm text-gray-500">U plaatst deze opdracht voor uw eigen organisatie</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                formData.poster_type === 'INTERMEDIARY'
                  ? 'border-[#4FA151] bg-[#4FA151]/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="poster_type"
                  value="INTERMEDIARY"
                  checked={formData.poster_type === 'INTERMEDIARY'}
                  onChange={() => setFormData({ ...formData, poster_type: 'INTERMEDIARY' as PosterType })}
                  className="sr-only"
                />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.poster_type === 'INTERMEDIARY' ? 'bg-[#4FA151]' : 'bg-gray-200'
                }`}>
                  <Users className={`w-5 h-5 ${formData.poster_type === 'INTERMEDIARY' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${formData.poster_type === 'INTERMEDIARY' ? 'text-[#0F172A]' : 'text-gray-700'}`}>
                    Intermediair / bemiddelingsbureau
                  </p>
                  <p className="text-sm text-gray-500">U plaatst deze opdracht namens een opdrachtgever</p>
                </div>
              </label>
            </div>
          </div>

          {formData.poster_type === 'INTERMEDIARY' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-[#0F172A] mb-4">Intermediair gegevens</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plaatsing namens (organisatie)</label>
                  <input
                    type="text"
                    value={formData.on_behalf_of || ''}
                    onChange={(e) => setFormData({ ...formData, on_behalf_of: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                    placeholder="Naam van de opdrachtgever"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contactpersoon</label>
                  <input
                    type="text"
                    value={formData.contact_person || ''}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                    placeholder="Naam contactpersoon"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous || false}
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-[#4FA151] focus:ring-[#4FA151]"
                  />
                  <div>
                    <span className="font-medium text-[#0F172A]">Anoniem publiceren</span>
                    <p className="text-sm text-gray-500">De naam van de opdrachtgever wordt niet getoond aan professionals</p>
                  </div>
                </label>
              </div>
            </div>
          )}

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
              className="w-full md:w-auto flex items-center justify-center bg-[#16A34A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#15803d] transition disabled:opacity-50"
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
                    {job.poster_type === 'INTERMEDIARY' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Intermediair
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  {job.poster_type === 'INTERMEDIARY' && job.on_behalf_of && !job.is_anonymous && (
                    <p className="text-sm text-gray-500 mt-1">Namens: {job.on_behalf_of}</p>
                  )}
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
                  className="flex items-center text-[#16A34A] hover:underline"
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
