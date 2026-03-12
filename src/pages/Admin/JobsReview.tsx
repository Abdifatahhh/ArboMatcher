import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { listJobsForReview, getJobReviewStats } from '../../services/adminJobsService';
import {
  setUnderReview,
  requestChanges,
  approveJob,
  rejectJob,
  publishJob,
} from '../../services/jobReviewService';
import type { AdminJobRow } from '../../services/adminJobsService';
import type { ReviewStatusFilter } from '../../services/adminJobsService';
import { JobReviewStatusBadge } from '../../components/jobReview/JobReviewStatusBadge';
import { JobScoreBadge } from '../../components/jobReview/JobScoreBadge';
import { AdminJobReviewDrawer } from '../../components/Admin/AdminJobReviewDrawer';
import { getContractFormLabel, getRemoteTypeLabel } from '../../lib/opdrachtConstants';
import {
  Briefcase,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Send,
  XCircle,
  Eye,
  Loader2,
} from 'lucide-react';

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
    try {
      const res = await listJobsForReview({
        review_status: statusFilter || undefined,
        search: search.trim() || undefined,
        page,
        pageSize: PAGE_SIZE,
        sort,
      });
      setRows(res.data);
      setTotal(res.total);
    } catch {
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    load();
    loadStats();
  };

  const loadStats = async () => {
    try {
      const s = await getJobReviewStats();
      setStats(s);
    } catch {}
  };

  useEffect(() => {
    load();
  }, [page, statusFilter, sort]);

  useEffect(() => {
    loadStats();
  }, [rows]);

  const runAction = async (
    jobId: string,
    fn: () => Promise<{ error: string | null }>
  ) => {
    setActionLoading(jobId);
    const { error } = await fn();
    setActionLoading(null);
    if (error) toast.error(error);
    else {
      toast.success('Uitgevoerd.');
      load();
      loadStats();
      setShowRejectModal(null);
      setShowChangesModal(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <FileCheck className="w-8 h-8 text-[#4FA151]" />
        Opdrachten review
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Beoordeel en publiceer opdrachten</p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Totaal</p>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.total ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Ingediend</p>
          <p className="text-2xl font-bold text-blue-700">{stats.submitted ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">In review</p>
          <p className="text-2xl font-bold text-amber-700">{stats.under_review ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Aanvulling</p>
          <p className="text-2xl font-bold text-orange-700">{stats.changes_requested ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Goedgekeurd</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.approved ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Gepubliceerd</p>
          <p className="text-2xl font-bold text-green-700">{stats.published ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Gem. score</p>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.average_score != null ? `${stats.average_score}%` : '—'}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Zoek op titel of bedrijfsnaam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (setPage(1), load())}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4FA151]"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as ReviewStatusFilter); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option value="">Alle statussen</option>
          <option value="submitted">Ingediend</option>
          <option value="under_review">In review</option>
          <option value="changes_requested">Aanvulling gevraagd</option>
          <option value="approved">Goedgekeurd</option>
          <option value="published">Gepubliceerd</option>
          <option value="rejected">Afgewezen</option>
          <option value="draft">Concept</option>
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option value="newest">Nieuwste eerst</option>
          <option value="oldest">Oudste eerst</option>
          <option value="score_high">Hoogste score</option>
          <option value="score_low">Laagste score</option>
        </select>
        <button
          type="button"
          onClick={() => { setPage(1); load(); }}
          className="px-4 py-2 bg-[#4FA151] text-white rounded-lg font-medium hover:bg-[#3E8E45]"
        >
          Zoeken
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-[#4FA151]" />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-emerald-100 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen opdrachten</h3>
          <p className="text-gray-500">Pas filters aan.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-emerald-100 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F4FAF4] border-b border-emerald-100">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">Titel</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">Opdrachtgever</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">Bedrijf</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">Contract</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ job, employer }) => (
                    <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
<button
                  type="button"
                  onClick={() => setSelectedId(selectedId === job.id ? null : job.id)}
                  className="text-left font-medium text-[#0F172A] hover:text-[#4FA151] underline decoration-dotted"
                >
                  {job.title}
                </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">—</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{employer?.company_name ?? job.company_name ?? '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{getContractFormLabel(job.job_type)} / {getRemoteTypeLabel(job.remote_type)}</td>
                      <td className="py-3 px-4">
                        <JobReviewStatusBadge status={job.review_status ?? 'draft'} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        {job.overall_score != null ? (
                          <JobScoreBadge score={job.overall_score} size="sm" showLabel={false} />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => setSelectedId(job.id)}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium"
                            title="Bekijken"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(job.review_status === 'submitted' || job.review_status === 'changes_requested') && (
                            <button
                              onClick={() => runAction(job.id, () => setUnderReview(job.id, user!.id))}
                              disabled={!!actionLoading}
                              className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-medium"
                              title="In review zetten"
                            >
                              {actionLoading === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Review'}
                            </button>
                          )}
                          {(job.review_status === 'submitted' || job.review_status === 'under_review') && (
                            <>
                              <button
                                onClick={() => setShowChangesModal(job.id)}
                                className="p-1.5 rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs font-medium"
                                title="Aanvulling vragen"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => runAction(job.id, () => approveJob(job.id, user!.id))}
                                disabled={!!actionLoading}
                                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-medium"
                                title="Goedkeuren"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowRejectModal(job.id)}
                                className="p-1.5 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 text-xs font-medium"
                                title="Afwijzen"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {job.review_status === 'approved' && (
                            <button
                              onClick={() => runAction(job.id, () => publishJob(job.id, user!.id))}
                              disabled={!!actionLoading}
                              className="p-1.5 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 text-xs font-medium"
                              title="Publiceren"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} van {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  Vorige
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  Volgende
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-lg mb-2">Afwijzen</h3>
            <p className="text-sm text-gray-600 mb-4">Reden verplicht (zichtbaar voor organisatie):</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              rows={3}
              placeholder="Bijv. De opdracht voldoet niet aan de kwaliteitseisen."
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowRejectModal(null); setRejectReason(''); }} className="px-4 py-2 border rounded-lg">Annuleren</button>
              <button
                onClick={() => {
                  if (!rejectReason.trim()) { toast.error('Vul een reden in'); return; }
                  runAction(showRejectModal, () => rejectJob(showRejectModal, user!.id, rejectReason));
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Afwijzen
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-lg mb-2">Aanvulling vragen</h3>
            <p className="text-sm text-gray-600 mb-4">Reden (zichtbaar voor organisatie):</p>
            <textarea
              value={changesReason}
              onChange={(e) => setChangesReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              rows={3}
              placeholder="Beschrijf wat ontbreekt of aangepast moet worden."
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowChangesModal(null); setChangesReason(''); }} className="px-4 py-2 border rounded-lg">Annuleren</button>
              <button
                onClick={() => {
                  if (!changesReason.trim()) { toast.error('Vul een reden in'); return; }
                  runAction(showChangesModal, () => requestChanges(showChangesModal, user!.id, changesReason));
                  setChangesReason('');
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg"
              >
                Verstuur
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminJobReviewDrawer
        jobId={selectedId}
        onClose={() => setSelectedId(null)}
        onAction={refresh}
      />
    </div>
  );
}
