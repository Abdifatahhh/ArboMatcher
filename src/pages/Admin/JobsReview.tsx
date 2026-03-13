import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { listJobsForReview, getJobReviewStats } from '../../services/adminJobsService';
import { setUnderReview, requestChanges, approveJob, rejectJob, publishJob } from '../../services/jobReviewService';
import type { AdminJobRow, ReviewStatusFilter } from '../../services/adminJobsService';
import { JobReviewStatusBadge } from '../../components/jobReview/JobReviewStatusBadge';
import { JobScoreBadge } from '../../components/jobReview/JobScoreBadge';
import { AdminJobReviewDrawer } from '../../components/Admin/AdminJobReviewDrawer';
import { getContractFormLabel, getRemoteTypeLabel } from '../../lib/opdrachtConstants';
import { Briefcase, FileCheck, AlertCircle, CheckCircle, Send, XCircle, Eye, Loader2 } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminPagination } from '../../components/Admin/adminUI';
import { filterStyles as f } from '../../components/Admin/AdminFiltersBar';
import { tableStyles as t } from '../../components/Admin/AdminTableWrapper';

const PAGE_SIZE = 20;

export default function AdminJobsReview() {
  const { user } = useAuth();
  const toast = useToast();
  const [rows, setRows] = useState<AdminJobRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'score_high' | 'score_low'>('newest');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [changesReason, setChangesReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showChangesModal, setShowChangesModal] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { const res = await listJobsForReview({ review_status: statusFilter || undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE, sort }); setRows(res.data); setTotal(res.total); }
    catch { setRows([]); setTotal(0); } finally { setLoading(false); }
  };

  const refresh = () => { load(); loadStats(); };
  const loadStats = async () => { try { setStats(await getJobReviewStats()); } catch {} };

  useEffect(() => { load(); }, [page, statusFilter, sort]);
  useEffect(() => { loadStats(); }, [rows]);

  const runAction = async (jobId: string, fn: () => Promise<{ error: string | null }>) => {
    setActionLoading(jobId);
    const { error } = await fn();
    setActionLoading(null);
    if (error) toast.error(error);
    else { toast.success('Uitgevoerd.'); load(); loadStats(); setShowRejectModal(null); setShowChangesModal(null); }
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const statCards: { label: string; key: string; color: string }[] = [
    { label: 'Totaal', key: 'total', color: 'text-slate-900' },
    { label: 'Ingediend', key: 'submitted', color: 'text-sky-700' },
    { label: 'In review', key: 'under_review', color: 'text-amber-700' },
    { label: 'Aanvulling', key: 'changes_requested', color: 'text-orange-700' },
    { label: 'Goedgekeurd', key: 'approved', color: 'text-emerald-700' },
    { label: 'Gepubliceerd', key: 'published', color: 'text-green-700' },
    { label: 'Gem. score', key: 'average_score', color: 'text-slate-900' },
  ];

  return (
    <AdminPage>
      <AdminPageHeader icon={FileCheck} title="Opdrachten review" description="Beoordeel en publiceer opdrachten" />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {statCards.map((sc) => (
          <div key={sc.key} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{sc.label}</p>
            <p className={`text-2xl font-semibold ${sc.color} mt-1`}>
              {sc.key === 'average_score' ? (stats.average_score != null ? `${stats.average_score}%` : '—') : (stats[sc.key] ?? 0)}
            </p>
          </div>
        ))}
      </div>

      <AdminFiltersBar>
        <div className="flex-1 min-w-[200px]">
          <label className={f.label}>Zoeken</label>
          <input type="text" placeholder="Titel of bedrijfsnaam..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (setPage(1), load())} className={f.input} />
        </div>
        <div>
          <label className={f.label}>Status</label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as ReviewStatusFilter); setPage(1); }} className={f.select}>
            <option value="">Alle statussen</option>
            <option value="submitted">Ingediend</option>
            <option value="under_review">In review</option>
            <option value="changes_requested">Aanvulling gevraagd</option>
            <option value="approved">Goedgekeurd</option>
            <option value="published">Gepubliceerd</option>
            <option value="rejected">Afgewezen</option>
            <option value="draft">Concept</option>
          </select>
        </div>
        <div>
          <label className={f.label}>Sorteren</label>
          <select value={sort} onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }} className={f.select}>
            <option value="newest">Nieuwste eerst</option>
            <option value="oldest">Oudste eerst</option>
            <option value="score_high">Hoogste score</option>
            <option value="score_low">Laagste score</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" onClick={() => { setPage(1); load(); }} className="h-9 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">Zoeken</button>
        </div>
      </AdminFiltersBar>

      {loading ? <AdminLoadingState rows={6} /> : rows.length === 0 ? (
        <AdminTableWrapper><AdminEmptyState icon={Briefcase} title="Geen opdrachten" description="Pas filters aan." /></AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <table className={t.table}>
              <thead className={t.thead}>
                <tr>
                  <th className={t.th}>Titel</th>
                  <th className={t.th}>Bedrijf</th>
                  <th className={t.th}>Contract</th>
                  <th className={t.th}>Status</th>
                  <th className={t.th}>Score</th>
                  <th className={t.thRight}>Acties</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ job, employer }) => (
                  <tr key={job.id} className={t.row}>
                    <td className={t.td}>
                      <button type="button" onClick={() => setSelectedId(selectedId === job.id ? null : job.id)} className="text-left font-medium text-slate-900 hover:text-blue-600 transition-colors">{job.title}</button>
                    </td>
                    <td className={t.td}>{employer?.company_name ?? job.company_name ?? '—'}</td>
                    <td className={t.td}><span className="text-xs">{getContractFormLabel(job.job_type)} / {getRemoteTypeLabel(job.remote_type)}</span></td>
                    <td className={t.td}><JobReviewStatusBadge status={job.review_status ?? 'draft'} size="sm" /></td>
                    <td className={t.td}>{job.overall_score != null ? <JobScoreBadge score={job.overall_score} size="sm" showLabel={false} /> : <span className="text-slate-300">—</span>}</td>
                    <td className={`${t.td} text-right`}>
                      <div className="flex flex-wrap items-center justify-end gap-1">
                        <button onClick={() => setSelectedId(job.id)} className={t.actionBtn} title="Bekijken"><Eye className="w-4 h-4" /></button>
                        {(job.review_status === 'submitted' || job.review_status === 'changes_requested') && (
                          <button onClick={() => runAction(job.id, () => setUnderReview(job.id, user!.id))} disabled={!!actionLoading} className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 disabled:opacity-50 transition" title="In review">
                            {actionLoading === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Review'}
                          </button>
                        )}
                        {(job.review_status === 'submitted' || job.review_status === 'under_review') && (
                          <>
                            <button onClick={() => setShowChangesModal(job.id)} className="p-1.5 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 transition" title="Aanvulling"><AlertCircle className="w-3.5 h-3.5" /></button>
                            <button onClick={() => runAction(job.id, () => approveJob(job.id, user!.id))} disabled={!!actionLoading} className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition" title="Goedkeuren"><CheckCircle className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setShowRejectModal(job.id)} className="p-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition" title="Afwijzen"><XCircle className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                        {job.review_status === 'approved' && (
                          <button onClick={() => runAction(job.id, () => publishJob(job.id, user!.id))} disabled={!!actionLoading} className="p-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition" title="Publiceren"><Send className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Afwijzen</h3>
            <p className="text-sm text-slate-500 mb-4">Reden verplicht (zichtbaar voor organisatie):</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-4" rows={3} placeholder="De opdracht voldoet niet aan de kwaliteitseisen." />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowRejectModal(null); setRejectReason(''); }} className="px-4 py-2 border border-slate-200 rounded-lg text-sm">Annuleren</button>
              <button onClick={() => { if (!rejectReason.trim()) { toast.error('Vul een reden in'); return; } runAction(showRejectModal, () => rejectJob(showRejectModal, user!.id, rejectReason)); setRejectReason(''); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">Afwijzen</button>
            </div>
          </div>
        </div>
      )}

      {showChangesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Aanvulling vragen</h3>
            <p className="text-sm text-slate-500 mb-4">Reden (zichtbaar voor organisatie):</p>
            <textarea value={changesReason} onChange={(e) => setChangesReason(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-4" rows={3} placeholder="Beschrijf wat ontbreekt of aangepast moet worden." />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowChangesModal(null); setChangesReason(''); }} className="px-4 py-2 border border-slate-200 rounded-lg text-sm">Annuleren</button>
              <button onClick={() => { if (!changesReason.trim()) { toast.error('Vul een reden in'); return; } runAction(showChangesModal, () => requestChanges(showChangesModal, user!.id, changesReason)); setChangesReason(''); }} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium">Verstuur</button>
            </div>
          </div>
        </div>
      )}

      <AdminJobReviewDrawer jobId={selectedId} onClose={() => setSelectedId(null)} onAction={refresh} />
    </AdminPage>
  );
}
