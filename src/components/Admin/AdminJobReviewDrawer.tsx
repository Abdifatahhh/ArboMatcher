import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getJobReviewHistory,
  getJobAdminNotes,
  addJobAdminNote,
  setUnderReview,
  requestChanges,
  approveJob,
  rejectJob,
  publishJob,
} from '../../services/jobReviewService';
import { buildChecklist } from '../../services/jobScoringService';
import type { Job, Employer } from '../../lib/types';
import type { JobReviewHistoryEntry, JobAdminNote, JobAIFeedback } from '../../lib/jobReviewTypes';
import { JobReviewStatusBadge } from '../jobReview/JobReviewStatusBadge';
import { JobScoreBadge } from '../jobReview/JobScoreBadge';
import { JobCompletionChecklist } from '../jobReview/JobCompletionChecklist';
import { JobAIReviewCard } from '../jobReview/JobAIReviewCard';
import { getContractFormLabel, getRemoteTypeLabel } from '../../lib/opdrachtConstants';
import { TARGET_PROFESSION_OPTIONS } from '../../lib/jobReviewTypes';
import {
  X,
  FileText,
  BarChart3,
  Eye,
  History,
  StickyNote,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
} from 'lucide-react';

interface AdminJobReviewDrawerProps {
  jobId: string | null;
  onClose: () => void;
  onAction?: () => void;
}

type TabId = 'gegevens' | 'score' | 'preview' | 'historie' | 'notities';

function jobToAIFeedback(job: Job): JobAIFeedback {
  return {
    ai_status: (job.ai_status as JobAIFeedback['ai_status']) ?? 'idle',
    ai_feedback_summary: job.ai_feedback_summary ?? null,
    ai_strengths: Array.isArray(job.ai_strengths) ? job.ai_strengths : [],
    ai_improvements: Array.isArray(job.ai_improvements) ? job.ai_improvements : [],
    ai_warnings: Array.isArray(job.ai_warnings) ? job.ai_warnings : [],
    ai_suggested_changes: Array.isArray(job.ai_suggested_changes) ? job.ai_suggested_changes : [],
    ai_last_reviewed_at: job.ai_last_reviewed_at ?? null,
  };
}

export function AdminJobReviewDrawer({ jobId, onClose, onAction }: AdminJobReviewDrawerProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<TabId>('gegevens');
  const [job, setJob] = useState<(Job & { employers?: Employer | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<JobReviewHistoryEntry[]>([]);
  const [notes, setNotes] = useState<JobAdminNote[]>([]);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [changesReason, setChangesReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, employers(*)')
        .eq('id', jobId)
        .single();
      if (error || !data) {
        setJob(null);
      } else {
        setJob(data as Job & { employers?: Employer | null });
      }
      setLoading(false);
    })();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    getJobReviewHistory(jobId).then(setHistory).catch(() => setHistory([]));
    getJobAdminNotes(jobId).then(setNotes).catch(() => setNotes([]));
  }, [jobId]);

  const runAction = async (
    key: string,
    fn: () => Promise<{ error: string | null }>
  ) => {
    setActionLoading(key);
    const { error } = await fn();
    setActionLoading(null);
    if (error) toast.error(error);
    else {
      toast.success('Uitgevoerd.');
      onAction?.();
      if (jobId) {
        const { data } = await supabase.from('jobs').select('*, employers(*)').eq('id', jobId).single();
        if (data) setJob(data as Job & { employers?: Employer | null });
      }
      setShowChangesModal(false);
      setShowRejectModal(false);
      setChangesReason('');
      setRejectReason('');
    }
  };

  const handleAddNote = async () => {
    if (!jobId || !noteText.trim() || !user) return;
    setAddingNote(true);
    const { error } = await addJobAdminNote(jobId, noteText.trim(), user.id);
    setAddingNote(false);
    if (error) toast.error(error);
    else {
      toast.success('Notitie toegevoegd.');
      setNoteText('');
      getJobAdminNotes(jobId).then(setNotes).catch(() => {});
    }
  };

  if (!jobId) return null;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'gegevens', label: 'Gegevens', icon: <FileText className="w-4 h-4" /> },
    { id: 'score', label: 'Score & AI', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'preview', label: 'Live preview', icon: <Eye className="w-4 h-4" /> },
    { id: 'historie', label: 'Historie', icon: <History className="w-4 h-4" /> },
    { id: 'notities', label: 'Admin notities', icon: <StickyNote className="w-4 h-4" /> },
  ];

  const employer = job?.employers ?? null;
  const checklist = job ? buildChecklist(job, employer) : null;
  const aiFeedback = job ? jobToAIFeedback(job) : null;
  const targetProfessionLabel =
    job?.target_profession
      ? TARGET_PROFESSION_OPTIONS.find((o) => o.value === job.target_profession)?.label ?? job.target_profession
      : '—';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} aria-hidden />
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            {loading ? 'Laden...' : job?.title ?? 'Opdracht'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {job && (
          <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <JobReviewStatusBadge status={job.review_status ?? 'draft'} size="sm" />
            {job.overall_score != null && (
              <JobScoreBadge score={job.overall_score} size="sm" showLabel />
            )}
            <div className="flex gap-1 ml-auto">
              {(job.review_status === 'submitted' || job.review_status === 'changes_requested') && (
                <button
                  onClick={() => runAction('under_review', () => setUnderReview(job.id, user!.id))}
                  disabled={!!actionLoading}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium hover:bg-amber-200"
                >
                  {actionLoading === 'under_review' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'In review'}
                </button>
              )}
              {(job.review_status === 'submitted' || job.review_status === 'under_review') && (
                <>
                  <button
                    onClick={() => setShowChangesModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 text-sm font-medium hover:bg-orange-200"
                  >
                    Aanvulling vragen
                  </button>
                  <button
                    onClick={() => runAction('approve', () => approveJob(job.id, user!.id))}
                    disabled={!!actionLoading}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-medium hover:bg-emerald-200"
                  >
                    {actionLoading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Goedkeuren'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200"
                  >
                    Afwijzen
                  </button>
                </>
              )}
              {job.review_status === 'approved' && (
                <button
                  onClick={() => runAction('publish', () => publishJob(job.id, user!.id))}
                  disabled={!!actionLoading}
                  className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200"
                >
                  {actionLoading === 'publish' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publiceren'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                tab === t.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-gray-600 hover:text-[#0F172A]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
            </div>
          ) : !job ? (
            <p className="text-gray-500">Opdracht niet gevonden.</p>
          ) : (
            <>
              {tab === 'gegevens' && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Opdracht</h3>
                    <dl className="grid grid-cols-1 gap-2 text-sm">
                      <div><dt className="text-gray-500">Titel</dt><dd className="font-medium">{job.title}</dd></div>
                      <div><dt className="text-gray-500">Beschrijving</dt><dd className="whitespace-pre-wrap">{job.description ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Eisen / wensen</dt><dd>{job.requirements ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Startdatum</dt><dd>{job.start_date ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Duur</dt><dd>{job.duration_weeks != null ? `${job.duration_weeks} weken` : '—'}</dd></div>
                      <div><dt className="text-gray-500">Uren/week</dt><dd>{job.hours_per_week ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Tarief/salaris</dt><dd>{job.rate_min != null || job.rate_max != null ? `${job.rate_min ?? '?'} – ${job.rate_max ?? '?'}` : '—'}</dd></div>
                      <div><dt className="text-gray-500">Contractvorm</dt><dd>{getContractFormLabel(job.job_type)}</dd></div>
                      <div><dt className="text-gray-500">Werkwijze</dt><dd>{getRemoteTypeLabel(job.remote_type)}</dd></div>
                      <div><dt className="text-gray-500">Locatie</dt><dd>{job.region ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Type professional</dt><dd>{targetProfessionLabel}</dd></div>
                      <div><dt className="text-gray-500">Status</dt><dd>{job.review_status ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Aangemaakt</dt><dd>{job.created_at ? new Date(job.created_at).toLocaleString('nl-NL') : '—'}</dd></div>
                      <div><dt className="text-gray-500">Laatst gewijzigd</dt><dd>{job.updated_at ? new Date(job.updated_at).toLocaleString('nl-NL') : '—'}</dd></div>
                      {job.submitted_at && <div><dt className="text-gray-500">Ingediend</dt><dd>{new Date(job.submitted_at).toLocaleString('nl-NL')}</dd></div>}
                      {job.approved_at && <div><dt className="text-gray-500">Goedgekeurd</dt><dd>{new Date(job.approved_at).toLocaleString('nl-NL')}</dd></div>}
                      {job.published_at && <div><dt className="text-gray-500">Gepubliceerd</dt><dd>{new Date(job.published_at).toLocaleString('nl-NL')}</dd></div>}
                    </dl>
                  </section>
                  <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Organisatie</h3>
                    <dl className="grid grid-cols-1 gap-2 text-sm">
                      <div><dt className="text-gray-500">Bedrijfsnaam</dt><dd className="font-medium">{employer?.company_name ?? job.company_name ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">KvK</dt><dd>{employer?.kvk_number ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Contactpersoon</dt><dd>{employer?.contact_person ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">E-mail</dt><dd>{employer?.email ?? '—'}</dd></div>
                      <div><dt className="text-gray-500">Telefoon</dt><dd>{employer?.phone ?? '—'}</dd></div>
                    </dl>
                  </section>
                </div>
              )}

              {tab === 'score' && (
                <div className="space-y-6">
                  <div className="flex gap-4 flex-wrap">
                    {job.structure_score != null && (
                      <div><span className="text-xs text-gray-500">Structure</span><br /><JobScoreBadge score={job.structure_score} size="md" /></div>
                    )}
                    {job.ai_score != null && (
                      <div><span className="text-xs text-gray-500">AI</span><br /><JobScoreBadge score={job.ai_score} size="md" /></div>
                    )}
                    {job.overall_score != null && (
                      <div><span className="text-xs text-gray-500">Totaal</span><br /><JobScoreBadge score={job.overall_score} size="md" showLabel /></div>
                    )}
                  </div>
                  {checklist && <JobCompletionChecklist items={checklist.items} />}
                  <JobAIReviewCard feedback={aiFeedback} />
                </div>
              )}

              {tab === 'preview' && (
                <div className="bg-gray-50 rounded-xl p-6 text-sm">
                  <h3 className="font-semibold text-[#0F172A] mb-2">{job.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap mb-4">{job.description ?? ''}</p>
                  <div className="flex flex-wrap gap-2 text-gray-500">
                    <span>{getContractFormLabel(job.job_type)}</span>
                    <span>•</span>
                    <span>{getRemoteTypeLabel(job.remote_type)}</span>
                    {job.region && <><span>•</span><span>{job.region}</span></>}
                    {job.hours_per_week != null && <><span>•</span><span>{job.hours_per_week} u/w</span></>}
                  </div>
                  <p className="mt-4 text-gray-400">Live preview komt overeen met de weergave op het platform.</p>
                </div>
              )}

              {tab === 'historie' && (
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-sm">Geen historie.</p>
                  ) : (
                    history.map((h) => (
                      <div key={h.id} className="flex gap-3 py-2 border-b border-gray-100 text-sm">
                        <span className="text-gray-500 shrink-0">{new Date(h.created_at).toLocaleString('nl-NL')}</span>
                        <span className="font-medium">{h.action}</span>
                        {h.old_status && <span className="text-gray-500">{h.old_status} →</span>}
                        <span>{h.new_status}</span>
                        {h.note && <span className="text-gray-600">({h.note})</span>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {tab === 'notities' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Interne notitie..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      rows={2}
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim() || addingNote}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-500 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    >
                      {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Toevoegen'}
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {notes.length === 0 ? (
                      <li className="text-gray-500 text-sm">Geen notities.</li>
                    ) : (
                      notes.map((n) => (
                        <li key={n.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                          <p className="text-gray-700">{n.note}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString('nl-NL')}</p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showChangesModal && job && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-lg mb-2">Aanvulling vragen</h3>
            <textarea
              value={changesReason}
              onChange={(e) => setChangesReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              rows={3}
              placeholder="Reden (zichtbaar voor organisatie)"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowChangesModal(false); setChangesReason(''); }} className="px-4 py-2 border rounded-lg">Annuleren</button>
              <button
                onClick={() => {
                  if (!changesReason.trim()) { toast.error('Vul een reden in'); return; }
                  runAction('changes', () => requestChanges(job.id, user!.id, changesReason));
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg"
              >
                Verstuur
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && job && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-lg mb-2">Afwijzen</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              rows={3}
              placeholder="Reden (verplicht, zichtbaar voor organisatie)"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="px-4 py-2 border rounded-lg">Annuleren</button>
              <button
                onClick={() => {
                  if (!rejectReason.trim()) { toast.error('Vul een reden in'); return; }
                  runAction('reject', () => rejectJob(job.id, user!.id, rejectReason));
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Afwijzen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
