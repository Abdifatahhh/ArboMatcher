import { Link } from 'react-router-dom';
import type { AdminApplicationRow } from '../../services/adminApplicationsService';

const STATUS_STYLE: Record<string, string> = {
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  SHORTLISTED: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-gray-100 text-gray-800',
};

interface ApplicationsTableProps {
  rows: AdminApplicationRow[];
  onStatusChange: (applicationId: string, status: 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED') => void;
  isDemo?: boolean;
}

const APPLICATION_STATUSES = ['PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'] as const;

export function ApplicationsTable({ rows, onStatusChange, isDemo }: ApplicationsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opdracht</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Wijzig status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map(({ application, job, profile }) => (
              <tr key={application.id}>
                <td className="px-6 py-4">
                  <Link
                    to={`/opdrachten/${application.job_id}`}
                    className="text-sm font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                  >
                    {job?.title || '—'}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/artsen/${application.doctor_id}`}
                    className="text-sm text-gray-900 hover:underline"
                  >
                    {profile?.full_name || '—'}
                  </Link>
                  <div className="text-xs text-gray-500">{profile?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[application.status] ?? 'bg-gray-100 text-gray-800'}`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(application.created_at).toLocaleDateString('nl-NL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <select
                    value={application.status}
                    onChange={(e) => onStatusChange(application.id, e.target.value as typeof APPLICATION_STATUSES[number])}
                    disabled={isDemo}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#0F172A] disabled:opacity-60"
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
