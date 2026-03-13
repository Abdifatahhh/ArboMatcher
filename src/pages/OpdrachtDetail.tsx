import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getAuthBaseUrl } from '../config/portal';
import { AuthLink } from '../components/AuthLink';
import { useToast } from '../context/ToastContext';
import type { Job } from '../lib/types';
import { ArrowLeft, MapPin, Clock, Briefcase, Calendar, Building2, Users, Eye, ArrowRight, CheckCircle } from 'lucide-react';
import { getContractFormLabel, getRemoteTypeLabel } from '../lib/opdrachtConstants';
import { HowItWorksPreview } from '../components/home/HowItWorksPreview';
import { HowItWorksSteps } from '../components/home/HowItWorksSteps';

type FakeJob = import('../data/fakeJobs').FakeJob;
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
  const [processStep, setProcessStep] = useState(1);

  useEffect(() => {
    fetchJob();
    if (user && id && !id.startsWith('fake-')) {
      checkIfApplied();
    }
  }, [id, user]);

  useEffect(() => {
    if (!user || profile?.role !== 'professional' || !job || isFakeJob) {
      setDoctorPlan(null);
      return;
    }
    (async () => {
      const { data } = await supabase.from('professionals').select('plan').eq('user_id', user.id).maybeSingle();
      setDoctorPlan((data?.plan === 'PRO' ? 'PRO' : 'GRATIS') ?? null);
    })();
  }, [user, profile?.role, job?.id, isFakeJob]);

  const fetchJob = async () => {
    if (!id) return;

    if (id.startsWith('fake-')) {
      if (!import.meta.env.DEV) {
        setFetchError('Opdracht niet gevonden.');
        setJob(null);
        setLoading(false);
        return;
      }
      const { getFakeJobById } = await import('../data/fakeJobs');
      const fakeJob = getFakeJobById(id);
      if (fakeJob) {
        setJob(fakeJob);
        setIsFakeJob(true);
        setViewsCount(Math.floor(Math.random() * 80) + 20);
      } else {
        setFetchError('Opdracht niet gevonden.');
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
        .eq('professional_id', doctor.id)
        .maybeSingle();

      setHasApplied(!!data);
    }
  };

  const handleApply = async () => {
    if (!user || !job) {
      const base = getAuthBaseUrl();
      if (base) { window.location.href = base + '/'; return; }
      navigate('/login');
      return;
    }

    if (isFakeJob) {
      const base = getAuthBaseUrl();
      if (base) { window.location.href = base + '/register'; return; }
      navigate('/register');
      return;
    }

    if (profile?.role !== 'professional') {
      toast.error('Alleen professionals kunnen reageren op opdrachten');
      return;
    }

    const { data: doctor } = await supabase
      .from('professionals')
      .select('id, verification_status, plan')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!doctor) {
      toast.error('Eerst uw profiel aanmaken');
      navigate('/professional/profiel');
      return;
    }

    if (doctor.verification_status !== 'VERIFIED') {
      toast.error('Uw profiel moet eerst geverifieerd worden door een admin');
      return;
    }

    const jobTier = 'job_tier' in job ? job.job_tier : ((job as { is_pro?: boolean }).is_pro ? 'PRO' : 'STANDARD');
    const jobCreatedAt = job.created_at ? new Date(job.created_at).getTime() : 0;
    const cutoff48h = Date.now() - 48 * 60 * 60 * 1000;
    const plan = (doctor as { plan?: string }).plan ?? 'GRATIS';
    if (jobTier === 'PRO' && jobCreatedAt > cutoff48h && plan !== 'PRO') {
      toast.error('Deze PRO opdracht is de eerste 48 uur exclusief voor PRO professionals.');
      return;
    }

    setApplying(true);

    const { error } = await supabase.from('applications').insert({
      job_id: job.id,
      professional_id: doctor.id,
      message,
      status: 'PENDING'
    });

    if (error) {
      if (error.code === 'P0001' && error.message?.includes('PRO_48H_RULE')) {
        toast.error('Deze PRO opdracht is de eerste 48 uur exclusief voor PRO professionals.');
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

  const getProfessionalLabel = (title: string) => {
    if (!title) return '';
    const voor = title.indexOf(' voor ');
    if (voor > 0) return title.slice(0, voor).trim();
    const dash = title.indexOf(' - ');
    if (dash > 0) return title.slice(0, dash).trim();
    const words = title.split(/\s+/);
    if (words.length >= 2 && (words[1].toLowerCase() === 'adviseur' || words[1].toLowerCase() === 'arts')) return words.slice(0, 2).join(' ');
    return words[0] || title;
  };

  const descriptionWithoutClient = (text: string) => {
    if (!text) return '';
    const firstEnd = text.search(/[.\n]/);
    if (firstEnd === -1) return text;
    return text.slice(firstEnd + 1).replace(/^\s+/, '') || text;
  };

  const getApplicationsCount = (jobData: JobData): number => {
    if ('applications_count' in jobData) {
      return jobData.applications_count;
    }
    return Math.floor(Math.random() * 5) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Opdracht niet gevonden</h2>
          {fetchError && (
            <p className="text-slate-500 mb-4 max-w-md mx-auto">{fetchError}</p>
          )}
          <Link to="/opdrachten" className="text-[#0F172A] hover:underline font-medium">
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
    <div className="min-h-screen w-full bg-white">
      <section className="border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/opdrachten')}
            className="flex items-center gap-2 text-slate-400 hover:text-[#0F172A] transition mb-5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar opdrachten
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{getProfessionalLabel(job.title)}</h1>
                {!isFakeJob && jobTier === 'PRO' && (
                  <span className="px-2.5 py-1 bg-[#0F172A] text-white text-xs font-semibold rounded-lg">
                    PRO
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {job.region && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.region}
                  </span>
                )}
                {job.job_type && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Briefcase className="w-3.5 h-3.5" />
                    {getContractFormLabel(job.job_type)}
                  </span>
                )}
                {job.hours_per_week && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5" />
                    {job.hours_per_week} uur/week
                  </span>
                )}
              </div>
            </div>
            {!user && (
              <AuthLink
                to="/login"
                className="inline-flex items-center justify-center bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition whitespace-nowrap shadow-lg shadow-slate-900/10"
              >
                Direct solliciteren
              </AuthLink>
            )}
          </div>
        </div>
      </section>

      <div className="w-full relative">
        <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4 px-1">Omschrijving</h2>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                {!user ? (
                  <div className="text-slate-600 leading-relaxed whitespace-pre-wrap max-h-[320px] overflow-hidden">
                    {description ? descriptionWithoutClient(description) || 'Geen omschrijving beschikbaar.' : 'Geen omschrijving beschikbaar.'}
                  </div>
                ) : (
                  <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {description || 'Geen omschrijving beschikbaar.'}
                  </div>
                )}
              </div>
            </div>

            {user && profile?.role === 'professional' && !isFakeJob && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                {hasApplied ? (
                  <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-slate-500" />
                    U heeft al gereageerd op deze opdracht
                  </div>
                ) : !canApply ? (
                  <div className="bg-white p-5 rounded-xl border border-amber-200">
                    <p className="text-amber-900 font-medium mb-1">Deze PRO opdracht is de eerste 48 uur exclusief voor PRO professionals.</p>
                    {opensAt > Date.now() && (
                      <p className="text-amber-800 text-sm">{getCountdownText()}</p>
                    )}
                    <button disabled className="w-full mt-4 bg-slate-200 text-slate-400 py-3 rounded-xl font-semibold cursor-not-allowed">
                      Reageer op deze opdracht
                    </button>
                  </div>
                ) : !showApplicationForm ? (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1E293B] transition shadow-lg shadow-slate-900/10"
                  >
                    Reageer op deze opdracht
                  </button>
                ) : (
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-4">Uw reactie</h3>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Waarom bent u geschikt voor deze opdracht? (optioneel)"
                      rows={5}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 outline-none transition mb-4"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition disabled:opacity-50"
                      >
                        {applying ? 'Bezig...' : 'Verstuur reactie'}
                      </button>
                      <button
                        onClick={() => setShowApplicationForm(false)}
                        className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition"
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
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sticky top-24">
              <h3 className="font-bold text-[#0F172A] mb-4 px-1">Opdrachtdetails</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4.5 h-4.5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Publicatiedatum</p>
                    <p className="text-[#0F172A] font-semibold text-sm">{formatDate(job.created_at)}</p>
                  </div>
                </div>

                {job.region && (
                  <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Locatie</p>
                      <p className="text-[#0F172A] font-semibold text-sm">{job.region}</p>
                    </div>
                  </div>
                )}

                {job.job_type && (
                  <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Contractvorm</p>
                      <p className="text-[#0F172A] font-semibold text-sm">{getContractFormLabel(job.job_type)}</p>
                    </div>
                  </div>
                )}

                {user && job.hours_per_week && (
                  <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Uren per week</p>
                      <p className="text-[#0F172A] font-semibold text-sm">{job.hours_per_week} uur</p>
                    </div>
                  </div>
                )}

                {user && durationWeeks && durationWeeks > 0 && (
                  <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Duur opdracht</p>
                      <p className="text-[#0F172A] font-semibold text-sm">{durationWeeks > 52 ? `${Math.round(durationWeeks / 52)} jaar` : `${durationWeeks} weken`}</p>
                    </div>
                  </div>
                )}

                {user && remoteType && (
                  <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Werklocatie</p>
                      <p className="text-[#0F172A] font-semibold text-sm">{getRemoteTypeLabel(remoteType)}</p>
                    </div>
                  </div>
                )}

                {user && (
                  <>
                    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm text-sm">
                      <span className="flex items-center gap-2 text-slate-400">
                        <Eye className="w-4 h-4" />
                        Weergaven
                      </span>
                      <span className="font-semibold text-[#0F172A]">{viewsCount}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm text-sm">
                      <span className="flex items-center gap-2 text-slate-400">
                        <Users className="w-4 h-4" />
                        Reacties
                      </span>
                      <span className="font-semibold text-[#0F172A]">{applicationsCount}</span>
                    </div>
                  </>
                )}
              </div>

              {user && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                {profile?.role === 'professional' && !isFakeJob ? (
                  hasApplied ? (
                    <div className="bg-slate-100 border border-slate-200 text-slate-700 p-4 rounded-xl text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">U heeft al gereageerd</span>
                    </div>
                  ) : !canApply ? (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm">
                      <p className="font-medium mb-1">PRO opdracht</p>
                      {opensAt > Date.now() && <p className="text-amber-800 text-xs">{getCountdownText()}</p>}
                      <button disabled className="w-full mt-3 bg-slate-300 text-slate-500 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
                        Reageer (na 48u)
                      </button>
                    </div>
                  ) : !showApplicationForm ? (
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#0F172A] text-white py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
                    >
                      Reageer op deze opdracht
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <p className="text-sm text-slate-500 text-center">Vul uw reactie hiernaast in en verstuur.</p>
                  )
                ) : (
                  <>
                    <p className="text-sm text-slate-600 mb-3">Alleen professionals kunnen reageren op opdrachten.</p>
                    <AuthLink
                      to="/register"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#0F172A] text-white py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition text-sm"
                    >
                      Registreren als professional
                      <ArrowRight className="w-4 h-4" />
                    </AuthLink>
                  </>
                )}
              </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {!user && (
          <div
            className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-end min-h-[200px] pt-16 pb-8"
            style={{
              width: '100vw',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(248,250,252,0.95) 40%, #f8fafc 60%)',
            }}
          >
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 text-center">Volledige opdracht bekijken?</h2>
            <AuthLink
              to="/login"
              className="inline-flex items-center justify-center bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition mb-3"
            >
              Heeft u al een account? Log hier in
            </AuthLink>
            <p className="text-slate-500 text-sm">
              Nog geen account?{' '}
              <AuthLink to="/register" className="text-[#0F172A] font-medium hover:underline">
                Registreer gratis
              </AuthLink>
            </p>
          </div>
        )}
        </>
      </div>

      <section className="py-12 sm:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" aria-labelledby="process-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-14">
            <h2 id="process-title" className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">Hoe ArboMatcher werkt</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Van registratie tot uw eerste opdracht. Ontvang een e-mail wanneer er nieuwe opdrachten bij u passen.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <HowItWorksPreview activeStep={processStep} />
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2">
              <HowItWorksSteps activeStep={processStep} onStepChange={setProcessStep} />
            </div>
          </div>

        </div>
      </section>

      {user && profile?.role !== 'professional' && (
          <section className="mt-12 sm:mt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/30 p-5 sm:p-10 hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300">
                <CheckCircle className="w-12 h-12 text-slate-700 mb-4" />
                <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                  {user && profile?.role !== 'professional'
                    ? 'Professional worden en reageren op opdrachten?'
                    : 'Volledige opdracht bekijken en reageren?'}
                </h2>
                <p className="text-slate-600 mb-6">
                  {user && profile?.role !== 'professional'
                    ? 'Registreer als professional (met BIG-nummer) om te solliciteren op opdrachten en in contact te komen met organisaties.'
                    : 'Maak gratis een account aan om de volledige omschrijving te bekijken, direct te reageren en toegang te krijgen tot alle functies van ArboMatcher.'}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {!user && (
                    <AuthLink
                      to="/login"
                      className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
                    >
                      Inloggen
                    </AuthLink>
                  )}
                  <AuthLink
                    to="/register"
                    className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition"
                  >
                    {user && profile?.role !== 'professional' ? 'Registreren als professional' : 'Gratis registreren'}
                    <ArrowRight className="w-4 h-4" />
                  </AuthLink>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-700" />
                    Gratis account
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-700" />
                    Direct reageren
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-700" />
                    Alle opdrachten zien
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
    </div>
  );
}
