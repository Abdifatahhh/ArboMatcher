import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Job } from '../lib/types';
import { ArrowLeft, MapPin, Clock, Briefcase, Calendar, Building2, Users, Eye, ArrowRight, CheckCircle } from 'lucide-react';
import { getFakeJobById, type FakeJob } from '../data/fakeJobs';

type JobData = Job | FakeJob;

export default function OpdrachtDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isFakeJob, setIsFakeJob] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);
  const [doctorPlan, setDoctorPlan] = useState<'GRATIS' | 'PRO' | null>(null);

  useEffect(() => {
    fetchJob();
    if (user && id && !id.startsWith('fake-')) {
      checkIfApplied();
    }
  }, [id, user]);

  useEffect(() => {
    if (!user || profile?.role !== 'ARTS' || !job || isFakeJob) {
      setDoctorPlan(null);
      return;
    }
    (async () => {
      const { data } = await supabase.from('professionals').select('doctor_plan').eq('user_id', user.id).maybeSingle();
      setDoctorPlan((data?.doctor_plan === 'PRO' ? 'PRO' : 'GRATIS') ?? null);
    })();
  }, [user, profile?.role, job?.id, isFakeJob]);

  const fetchJob = async () => {
    if (!id) return;

    if (id.startsWith('fake-')) {
      const fakeJob = getFakeJobById(id);
      if (fakeJob) {
        setJob(fakeJob);
        setIsFakeJob(true);
        setViewsCount(Math.floor(Math.random() * 80) + 20);
      }
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      setFetchError(error.message);
    } else if (data) {
      setJob(data);
      setViewsCount(data.views_count || 0);
      incrementViews(data.id, data.views_count || 0);
    } else {
      setFetchError('Opdracht niet gevonden.');
    }
    setLoading(false);
  };

  const incrementViews = async (jobId: string, currentViews: number) => {
    await supabase
      .from('jobs')
      .update({ views_count: currentViews + 1 })
      .eq('id', jobId);
  };

  const checkIfApplied = async () => {
    if (!id || !user) return;

    const { data: doctor } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (doctor) {
      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('doctor_id', doctor.id)
        .maybeSingle();

      setHasApplied(!!data);
    }
  };

  const handleApply = async () => {
    if (!user || !job) {
      navigate('/login');
      return;
    }

    if (isFakeJob) {
      navigate('/register');
      return;
    }

    if (profile?.role !== 'ARTS') {
      toast.error('Alleen professionals kunnen reageren op opdrachten');
      return;
    }

    const { data: doctor } = await supabase
      .from('professionals')
      .select('id, verification_status, doctor_plan')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!doctor) {
      toast.error('Eerst uw profiel aanmaken');
      navigate('/arts/profiel');
      return;
    }

    if (doctor.verification_status !== 'VERIFIED') {
      toast.error('Uw profiel moet eerst geverifieerd worden door een admin');
      return;
    }

    const jobTier = 'job_tier' in job ? job.job_tier : ((job as { is_pro?: boolean }).is_pro ? 'PRO' : 'STANDARD');
    const jobCreatedAt = job.created_at ? new Date(job.created_at).getTime() : 0;
    const cutoff48h = Date.now() - 48 * 60 * 60 * 1000;
    const plan = (doctor as { doctor_plan?: string }).doctor_plan ?? 'GRATIS';
    if (jobTier === 'PRO' && jobCreatedAt > cutoff48h && plan !== 'PRO') {
      toast.error('Deze PRO opdracht is de eerste 48 uur exclusief voor PRO artsen.');
      return;
    }

    setApplying(true);

    const { error } = await supabase.from('applications').insert({
      job_id: job.id,
      doctor_id: doctor.id,
      message,
      status: 'PENDING'
    });

    if (error) {
      if (error.code === 'P0001' && error.message?.includes('PRO_48H_RULE')) {
        toast.error('Deze PRO opdracht is de eerste 48 uur exclusief voor PRO artsen.');
      } else {
        toast.error('Er is een fout opgetreden');
      }
    } else {
      toast.success('Reactie succesvol verstuurd!');
      setHasApplied(true);
      setShowApplicationForm(false);
    }

    setApplying(false);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'ZZP': return 'Freelance';
      case 'INTERIM': return 'Interim';
      case 'DETACHERING': return 'Detachering';
      case 'VAST': return 'Structureel';
      default: return type;
    }
  };

  const getRemoteTypeLabel = (type: string) => {
    switch (type) {
      case 'REMOTE': return 'Remote';
      case 'HYBRID': return 'Hybride';
      case 'ONSITE': return 'Op locatie';
      default: return type;
    }
  };

  const getApplicationsCount = (jobData: JobData): number => {
    if ('applications_count' in jobData) {
      return jobData.applications_count;
    }
    return Math.floor(Math.random() * 5) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Opdracht niet gevonden</h2>
          {fetchError && (
            <p className="text-gray-500 mb-4 max-w-md mx-auto">{fetchError}</p>
          )}
          <Link to="/opdrachten" className="text-[#4FA151] hover:underline">
            Terug naar opdrachten
          </Link>
        </div>
      </div>
    );
  }

  const description = isFakeJob ? (job as FakeJob).full_description : (job as Job).description;
  const remoteType = isFakeJob ? (job as FakeJob).remote_type : (job as Job).remote_type;
  const durationWeeks = isFakeJob ? (job as FakeJob).duration_weeks : (job as Job).duration_weeks;
  const applicationsCount = getApplicationsCount(job);

  const jobTier = !isFakeJob && job ? ('job_tier' in job ? (job as Job).job_tier : ((job as { is_pro?: boolean }).is_pro ? 'PRO' : 'STANDARD')) : 'STANDARD';
  const jobCreatedAt = job?.created_at ? new Date(job.created_at).getTime() : 0;
  const cutoff48h = Date.now() - 48 * 60 * 60 * 1000;
  const isProJobWithin48h = jobTier === 'PRO' && jobCreatedAt > cutoff48h;
  const canApply = !isProJobWithin48h || doctorPlan === 'PRO';
  const opensAt = jobTier === 'PRO' && jobCreatedAt ? jobCreatedAt + 48 * 60 * 60 * 1000 : 0;

  function getCountdownText(): string {
    if (opensAt <= Date.now()) return '';
    const diff = opensAt - Date.now();
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(hours / 24);
    if (days > 0) return `Beschikbaar over ${days} dag en ${hours % 24} uur`;
    return `Beschikbaar over ${hours} uur`;
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white">
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/opdrachten')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#0F172A] transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar opdrachten
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{job.title}</h1>
                {!isFakeJob && jobTier === 'PRO' && (
                  <span className="px-2.5 py-1 bg-[#4FA151]/15 text-[#4FA151] text-xs font-semibold rounded-full border border-[#4FA151]/30">
                    PRO
                  </span>
                )}
                {!isFakeJob && (job as Job).poster_type === 'INTERMEDIARY' && (
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    Via intermediair
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-500">
                {job.region && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.region}
                  </span>
                )}
                {job.job_type && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {getJobTypeLabel(job.job_type)}
                  </span>
                )}
                {job.hours_per_week && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.hours_per_week} uur/week
                  </span>
                )}
              </div>
            </div>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-[#4FA151] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition whitespace-nowrap"
              >
                Direct reageren
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[16px] p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">Omschrijving</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {!user ? (
                  <>
                    {description ? description.substring(0, 400) + '...' : 'Geen omschrijving beschikbaar.'}
                    <div className="mt-4 p-4 bg-[#F3F4F6] rounded-[12px] border border-gray-200">
                      <p className="text-[#0F172A] font-medium mb-2">Volledige omschrijving bekijken?</p>
                      <p className="text-sm text-gray-500">Registreer gratis om alle details te zien en direct te reageren.</p>
                    </div>
                  </>
                ) : (
                  description || 'Geen omschrijving beschikbaar.'
                )}
              </div>
            </div>

            {user && profile?.role === 'ARTS' && !isFakeJob && (
              <div className="bg-white rounded-[16px] p-6 border border-gray-100">
                {hasApplied ? (
                  <div className="bg-[#4FA151]/10 border border-[#4FA151] text-[#4FA151] p-4 rounded-[12px] text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    U heeft al gereageerd op deze opdracht
                  </div>
                ) : !canApply ? (
                  <div className="p-4 rounded-[12px] border border-amber-200 bg-amber-50">
                    <p className="text-amber-900 font-medium mb-1">Deze PRO opdracht is de eerste 48 uur exclusief voor PRO artsen.</p>
                    {opensAt > Date.now() && (
                      <p className="text-amber-800 text-sm">{getCountdownText()}</p>
                    )}
                    <button disabled className="w-full mt-4 bg-gray-300 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed">
                      Reageer op deze opdracht
                    </button>
                  </div>
                ) : !showApplicationForm ? (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
                  >
                    Reageer op deze opdracht
                  </button>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Uw reactie</h3>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Waarom bent u geschikt voor deze opdracht? (optioneel)"
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-[12px] focus:ring-2 focus:ring-[#4FA151] focus:border-transparent mb-4"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="flex-1 bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition disabled:opacity-50"
                      >
                        {applying ? 'Bezig...' : 'Verstuur reactie'}
                      </button>
                      <button
                        onClick={() => setShowApplicationForm(false)}
                        className="px-6 py-3 border border-gray-200 rounded-[12px] hover:bg-gray-50 transition"
                      >
                        Annuleren
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-[#0F172A] mb-4">Opdrachtdetails</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#4FA151]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Publicatiedatum</p>
                    <p className="text-[#0F172A] font-medium">{formatDate(job.created_at)}</p>
                  </div>
                </div>

                {job.region && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#4FA151]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Locatie</p>
                      <p className="text-[#0F172A] font-medium">{job.region}</p>
                    </div>
                  </div>
                )}

                {job.job_type && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-[#4FA151]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type inzet</p>
                      <p className="text-[#0F172A] font-medium">{getJobTypeLabel(job.job_type)}</p>
                    </div>
                  </div>
                )}

                {job.hours_per_week && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#4FA151]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Uren per week</p>
                      <p className="text-[#0F172A] font-medium">{job.hours_per_week} uur</p>
                    </div>
                  </div>
                )}

                {durationWeeks && durationWeeks > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#4FA151]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duur opdracht</p>
                      <p className="text-[#0F172A] font-medium">{durationWeeks > 52 ? `${Math.round(durationWeeks / 52)} jaar` : `${durationWeeks} weken`}</p>
                    </div>
                  </div>
                )}

                {remoteType && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-[#4FA151]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Werklocatie</p>
                      <p className="text-[#0F172A] font-medium">{getRemoteTypeLabel(remoteType)}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Eye className="w-4 h-4" />
                      Weergaven
                    </span>
                    <span className="font-medium text-[#0F172A]">{viewsCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      Reacties
                    </span>
                    <span className="font-medium text-[#0F172A]">{applicationsCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                {!user ? (
                  <>
                    <Link
                      to="/register"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
                    >
                      Direct reageren
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Al een account?{' '}
                      <Link to="/login" className="text-[#4FA151] hover:underline font-medium">
                        Inloggen
                      </Link>
                    </p>
                  </>
                ) : profile?.role === 'ARTS' && !isFakeJob ? (
                  hasApplied ? (
                    <div className="bg-[#4FA151]/10 border border-[#4FA151]/30 text-[#4FA151] p-4 rounded-xl text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">U heeft al gereageerd</span>
                    </div>
                  ) : !canApply ? (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm">
                      <p className="font-medium mb-1">PRO opdracht</p>
                      {opensAt > Date.now() && <p className="text-amber-800 text-xs">{getCountdownText()}</p>}
                      <button disabled className="w-full mt-3 bg-gray-300 text-gray-500 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
                        Reageer (na 48u)
                      </button>
                    </div>
                  ) : !showApplicationForm ? (
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition"
                    >
                      Reageer op deze opdracht
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">Vul uw reactie hiernaast in en verstuur.</p>
                  )
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3">Alleen artsen kunnen reageren op opdrachten.</p>
                    <Link
                      to="/register"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#4FA151] text-white py-3 rounded-xl font-semibold hover:bg-[#3E8E45] transition text-sm"
                    >
                      Registreren als arts
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {(!user || profile?.role !== 'ARTS') && (
          <div className="mt-12 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[16px] p-8 sm:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {user && profile?.role !== 'ARTS'
                  ? 'Arts worden en reageren op opdrachten?'
                  : 'Volledige opdracht bekijken en reageren?'}
              </h2>
              <p className="text-gray-300 mb-8">
                {user && profile?.role !== 'ARTS'
                  ? 'Registreer als arts (met BIG-nummer) om te solliciteren op opdrachten en in contact te komen met opdrachtgevers.'
                  : 'Maak gratis een account aan om de volledige omschrijving te bekijken, direct te reageren op opdrachten en toegang te krijgen tot alle functies van ArboMatcher.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!user && (
                  <Link
                    to="/login"
                    className="px-8 py-3 border border-white/20 rounded-[12px] font-semibold hover:bg-white/10 transition"
                  >
                    Inloggen
                  </Link>
                )}
                <Link
                  to="/register"
                  className="px-8 py-3 bg-[#4FA151] rounded-xl font-semibold hover:bg-[#3E8E45] transition flex items-center justify-center gap-2 shadow-lg shadow-[#4FA151]/25"
                >
                  {user && profile?.role !== 'ARTS' ? 'Registreren als arts' : 'Gratis registreren'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4FA151]" />
                  Gratis account
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4FA151]" />
                  Direct reageren
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4FA151]" />
                  Alle opdrachten zien
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
