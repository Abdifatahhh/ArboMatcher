import { Link } from 'react-router-dom';
import type { AdminJobRow } from '../../services/adminJobsService';
import { Briefcase, Eye } from 'lucide-react';

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
};

interface JobsTableProps {
  rows: AdminJobRow[];
  onStatusChange: (jobId: string, status: 'DRAFT' | 'PUBLISHED' | 'CLOSED') => void;
  isDemo?: boolean;
}

export function JobsTable({ rows, onStatusChange, isDemo }: JobsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opdracht</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opdrachtgever</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map(({ job, employer }) => (
              <tr key={job.id}>
                <td className="px-6 py-4">
                  <Link
                    to={`/opdrachten/${job.id}`}
                    className="text-sm font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                  >
                    {job.title}
                  </Link>
                  {job.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{job.description}</p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={employer ? `/admin/opdrachtgevers/${employer.id}` : '#'}
                    className="text-sm text-gray-900 hover:underline"
                  >
                    {job.company_name || employer?.company_name || '—'}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={job.status}
                    onChange={(e) => onStatusChange(job.id, e.target.value as 'DRAFT' | 'PUBLISHED' | 'CLOSED')}
                    disabled={isDemo}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#0F172A] disabled:opacity-60"
                  >
                    <option value="DRAFT">Concept</option>
                    <option value="PUBLISHED">Gepubliceerd</option>
                    <option value="CLOSED">Gesloten</option>
                  </select>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[job.status] ?? 'bg-gray-100 text-gray-800'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(job.created_at).toLocaleDateString('nl-NL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to={`/opdrachten/${job.id}`}
                    className="inline-flex items-center gap-1 text-sm text-[#4FA151] hover:underline"
                  >
                    <Eye className="w-4 h-4" />
                    Bekijk
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
