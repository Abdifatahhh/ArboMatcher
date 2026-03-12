import { Link } from 'react-router-dom';
import type { AdminJobRow } from '../../services/adminJobsService';
import { Briefcase, Eye } from 'lucide-react';

const JOB_STATUSES = ['DRAFT', 'PUBLISHED', 'CLOSED'] as const;
type JobStatusValue = typeof JOB_STATUSES[number];

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  CLOSED: 'bg-gray-100 text-gray-800 border border-gray-200',
  DRAFT: 'bg-amber-100 text-amber-800 border border-amber-200',
};

function normalizeJobStatus(s: string | undefined | null): JobStatusValue {
  if (s === 'DRAFT' || s === 'PUBLISHED' || s === 'CLOSED') return s;
  return 'DRAFT';
}

interface JobsTableProps {
  rows: AdminJobRow[];
  onStatusChange: (jobId: string, status: 'DRAFT' | 'PUBLISHED' | 'CLOSED') => void;
  isDemo?: boolean;
}

export function JobsTable({ rows, onStatusChange, isDemo }: JobsTableProps) {
  return (
    <div className="rounded-xl border border-emerald-100 overflow-hidden shadow-md bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#4FA151] border-b border-[#3E8E45]">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Opdracht</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Opdrachtgever</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {rows.map(({ job, employer }, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30';
              return (
                <tr key={job.id} className={`${rowBg} hover:bg-emerald-50/50 transition-colors`}>
                  <td className="px-6 py-4">
                    <Link to={`/opdrachten/${job.id}`} className="text-sm font-semibold text-[#0F172A] hover:text-[#4FA151] hover:underline transition">{job.title}</Link>
                    {job.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{job.description}</p>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={employer ? `/admin/organisaties/${employer.id}` : '#'} className="text-sm text-gray-800 hover:text-[#4FA151] hover:underline transition">{job.company_name || employer?.company_name || '—'}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={normalizeJobStatus(job.status)}
                      onChange={(e) => {
                        const v = e.target.value as JobStatusValue;
                        onStatusChange(job.id, v);
                      }}
                      className="text-sm border border-[#4FA151]/30 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] bg-white min-w-[140px]"
                    >
                      <option value="DRAFT">Concept</option>
                      <option value="PUBLISHED">Gepubliceerd</option>
                      <option value="CLOSED">Gesloten</option>
                    </select>
                    <span className={`ml-2 px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_STYLE[normalizeJobStatus(job.status)] ?? 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                      {normalizeJobStatus(job.status) === 'PUBLISHED' ? 'Gepubliceerd' : normalizeJobStatus(job.status) === 'DRAFT' ? 'Concept' : 'Gesloten'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(job.created_at).toLocaleDateString('nl-NL')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link to={`/opdrachten/${job.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#4FA151] hover:bg-emerald-100 transition"><Eye className="w-4 h-4" />Bekijk</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
