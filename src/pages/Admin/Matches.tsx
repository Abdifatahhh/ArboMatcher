import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  listPublishedJobsForMatch, getMatchesForJob, buildSummaryForOrganisation,
  type JobWithEmployer, type MatchResult,
} from '../../services/adminMatchService';
import { Users, Briefcase, Copy, Mail, CheckCircle, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { AdminPage, AdminPageHeader, AdminCard, AdminFiltersBar, AdminLoadingState, AdminEmptyState } from '../../components/Admin/adminUI';
import { filterStyles as f } from '../../components/Admin/AdminFiltersBar';
import { AdminBadge } from '../../components/Admin/AdminBadge';

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
      try { const list = await listPublishedJobsForMatch(); if (!cancelled) { setJobs(list); if (list.length > 0 && !selectedJobId) setSelectedJobId(list[0].job.id); } }
      catch { if (!cancelled) setJobs([]); }
      finally { if (!cancelled) setLoadingJobs(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedJobId) { setResult(null); return; }
    let cancelled = false;
    setLoadingMatches(true);
    getMatchesForJob(selectedJobId).then((res) => { if (!cancelled) { setResult(res); setLoadingMatches(false); } }).catch(() => { if (!cancelled) { setResult(null); setLoadingMatches(false); } });
    return () => { cancelled = true; };
  }, [selectedJobId]);

  const selectedJob = jobs.find((j) => j.job.id === selectedJobId);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(buildSummaryForOrganisation(result, baseUrl))
      .then(() => { setCopied(true); toast.success('Samenvatting gekopieerd'); setTimeout(() => setCopied(false), 2000); })
      .catch(() => toast.error('Kopiëren mislukt'));
  };

  const handleMailto = () => {
    if (!result?.employerEmail) { toast.error('Geen e-mailadres van organisatie bekend'); return; }
    const body = encodeURIComponent(buildSummaryForOrganisation(result, baseUrl));
    const subject = encodeURIComponent(`Aanbevolen kandidaten – ${result.job.title}`);
    window.location.href = `mailto:${result.employerEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <AdminPage>
      <AdminPageHeader icon={Sparkles} title="Match professionals" description="Kies een opdracht en stuur aanbevolen kandidaten door naar de organisatie" />

      <AdminFiltersBar>
        <div className="flex-1 min-w-[260px]">
          <label className={f.label}>Opdracht</label>
          {loadingJobs ? (
            <div className="flex items-center gap-2 h-9 text-sm text-slate-500"><div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-200 border-t-slate-500" /> Laden…</div>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-amber-600">Geen gepubliceerde opdrachten.</p>
          ) : (
            <div className="relative">
              <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)} className={`${f.select} w-full max-w-xl pr-10`}>
                {jobs.map(({ job, employer }) => <option key={job.id} value={job.id}>{job.title} — {employer?.company_name ?? job.company_name ?? 'Onbekend'}</option>)}
              </select>
              <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>
      </AdminFiltersBar>

      {selectedJob && (
        <AdminCard noPadding>
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-100">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900 text-sm">{selectedJob.job.title}</h2>
              <p className="text-xs text-slate-500">{selectedJob.employer?.company_name ?? selectedJob.job.company_name ?? '—'} · {selectedJob.job.region ?? 'Regio niet opgegeven'}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Gekopieerd' : 'Kopieer'}
              </button>
              <button type="button" onClick={handleMailto} disabled={!result?.employerEmail} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 px-3 py-1.5 text-xs font-medium text-white hover:from-emerald-600 hover:to-green-500 disabled:opacity-50 transition shadow-sm shadow-emerald-500/20">
                <Mail className="w-3.5 h-3.5" /> E-mail
              </button>
            </div>
          </div>

          {loadingMatches ? (
            <div className="py-16"><AdminLoadingState rows={3} /></div>
          ) : result && result.matches.length === 0 ? (
            <AdminEmptyState icon={Users} title="Geen matches" description="Geen matchende professionals (met toestemming) voor deze opdracht." />
          ) : result ? (
            <ul className="divide-y divide-slate-50">
              {result.matches.map((m) => (
                <li key={m.professional.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 shrink-0">
                      <User className="w-4 h-4 text-slate-500" />
                    </span>
                    <div>
                      {m.canShareProfileCv ? (
                        <>
                          <Link to={`/admin/professionals/${m.professional.id}`} className="text-sm font-medium text-slate-900 hover:text-emerald-600 transition-colors">{m.profile.full_name || 'Naam onbekend'}</Link>
                          {m.profile.email && <p className="text-xs text-slate-400">{m.profile.email}</p>}
                        </>
                      ) : (
                        <span className="text-sm text-slate-500">Professional (profiel niet gedeeld)</span>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.matchReasons.map((r) => (
                          <AdminBadge key={r} variant="success">{r === 'BIG geverifieerd' ? `✓ ${r}` : r}</AdminBadge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">Score {m.matchScore}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </AdminCard>
      )}
    </AdminPage>
  );
}
