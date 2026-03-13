import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  listPublishedJobsForMatch,
  getMatchesForJob,
  buildSummaryForOrganisation,
  type JobWithEmployer,
  type MatchResult,
} from '../../services/adminMatchService';
import {
  Users,
  Briefcase,
  Copy,
  Mail,
  CheckCircle,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminMatches() {
  const [jobs, setJobs] = useState<JobWithEmployer[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingJobs(true);
      try {
        const list = await listPublishedJobsForMatch();
        if (!cancelled) {
          setJobs(list);
          if (list.length > 0 && !selectedJobId) setSelectedJobId(list[0].job.id);
        }
      } catch {
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setLoadingJobs(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedJobId) {
      setResult(null);
      return;
    }
    let cancelled = false;
    setLoadingMatches(true);
    getMatchesForJob(selectedJobId).then((res) => {
      if (!cancelled) {
        setResult(res);
        setLoadingMatches(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setResult(null);
        setLoadingMatches(false);
      }
    });
    return () => { cancelled = true; };
  }, [selectedJobId]);

  const selectedJob = jobs.find((j) => j.job.id === selectedJobId);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = () => {
    if (!result) return;
    const text = buildSummaryForOrganisation(result, baseUrl);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('Samenvatting gekopieerd', 'success');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => showToast('Kopiëren mislukt', 'error'));
  };

  const handleMailto = () => {
    if (!result?.employerEmail) {
      toast.error('Geen e-mailadres van organisatie bekend');
      return;
    }
    const body = encodeURIComponent(buildSummaryForOrganisation(result, baseUrl));
    const subject = encodeURIComponent(`Aanbevolen kandidaten – ${result.job.title}`);
    window.location.href = `mailto:${result.employerEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <Sparkles className="w-8 h-8 text-[#4FA151]" />
        Match professionals met opdrachten
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">
        Kies een opdracht en stuur de aanbevolen kandidaten door naar de organisatie. Alleen professionals met toestemming worden getoond.
      </p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Opdracht</label>
        {loadingJobs ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-200 border-t-[#4FA151]" />
            Opdrachten laden…
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-amber-700">Geen gepubliceerde opdrachten.</p>
        ) : (
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full max-w-xl rounded-lg border border-emerald-200 bg-white px-4 py-2.5 pr-10 text-gray-900 focus:border-[#4FA151] focus:ring-2 focus:ring-[#4FA151]/20 outline-none"
            >
              {jobs.map(({ job, employer }) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {employer?.company_name ?? job.company_name ?? 'Onbekend'}
                </option>
              ))}
            </select>
            <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 pointer-events-none" />
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="bg-white rounded-xl border border-emerald-100 shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-emerald-100 bg-[#F4FAF4]/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">{selectedJob.job.title}</h2>
              <p className="text-sm text-gray-600">
                {selectedJob.employer?.company_name ?? selectedJob.job.company_name ?? '—'} · {selectedJob.job.region ?? 'Regio niet opgegeven'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg bg-white border border-emerald-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 transition"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-[#4FA151]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Gekopieerd' : 'Kopieer samenvatting'}
              </button>
              <button
                type="button"
                onClick={handleMailto}
                disabled={!result?.employerEmail}
                className="inline-flex items-center gap-2 rounded-lg bg-[#4FA151] px-4 py-2 text-sm font-medium text-white hover:bg-[#458f47] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Mail className="w-4 h-4" />
                E-mail naar organisatie
              </button>
            </div>
          </div>

          {loadingMatches ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
            </div>
          ) : result && result.matches.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-emerald-200" />
              <p>Geen matchende professionals (met toestemming) voor deze opdracht.</p>
            </div>
          ) : result ? (
            <ul className="divide-y divide-emerald-100">
              {result.matches.map((m) => (
                <li key={m.professional.id} className="p-4 hover:bg-emerald-50/50 transition">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="rounded-full bg-emerald-100 p-2 flex-shrink-0">
                        <User className="w-5 h-5 text-[#4FA151]" />
                      </div>
                      <div>
                        {m.canShareProfileCv ? (
                          <>
                            <Link
                              to={`/admin/professionals/${m.professional.id}`}
                              className="font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                            >
                              {m.profile.full_name || 'Naam onbekend'}
                            </Link>
                            {m.profile.email && (
                              <p className="text-sm text-gray-500">{m.profile.email}</p>
                            )}
                          </>
                        ) : (
                          <span className="font-medium text-gray-600">Professional (profiel niet gedeeld)</span>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {m.matchReasons.map((r) => (
                            <span
                              key={r}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800"
                            >
                              {r === 'BIG geverifieerd' ? <ShieldCheck className="w-3 h-3" /> : null}
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-[#4FA151]">Match {m.matchScore}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}
