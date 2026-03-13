import { Link } from 'react-router-dom';
import type { AdminApplicationRow } from '../../services/adminApplicationsService';

const STATUS_STYLE: Record<string, string> = {
  ACCEPTED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  REJECTED: 'bg-red-100 text-red-800 border border-red-200',
  SHORTLISTED: 'bg-blue-100 text-blue-800 border border-blue-200',
  PENDING: 'bg-gray-100 text-gray-800 border border-gray-200',
};

interface ApplicationsTableProps {
  rows: AdminApplicationRow[];
  onStatusChange: (applicationId: string, status: 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED') => void;
  isDemo?: boolean;
}

const APPLICATION_STATUSES = ['PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'] as const;
type AppStatus = typeof APPLICATION_STATUSES[number];

function normalizeAppStatus(s: string | undefined | null): AppStatus {
  if (APPLICATION_STATUSES.includes(s as AppStatus)) return s as AppStatus;
  return 'PENDING';
}

export function ApplicationsTable({ rows, onStatusChange, isDemo }: ApplicationsTableProps) {
  return (
    <div className="rounded-xl border border-emerald-100 overflow-hidden shadow-md bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#4FA151] border-b border-[#3E8E45]">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Opdracht</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Professional</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Wijzig status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {rows.map(({ application, job, profile }, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30';
              return (
                <tr key={application.id} className={`${rowBg} hover:bg-emerald-50/50 transition-colors`}>
                  <td className="px-6 py-4">
                    <Link to={`/opdrachten/${application.job_id}`} className="text-sm font-semibold text-[#0F172A] hover:text-[#4FA151] hover:underline transition">{job?.title || '—'}</Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/professionals/${application.doctor_id}`} className="text-sm text-gray-800 hover:text-[#4FA151] hover:underline transition">{profile?.full_name || '—'}</Link>
                    <div className="text-xs text-gray-500">{profile?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_STYLE[normalizeAppStatus(application.status)] ?? 'bg-gray-100 text-gray-800 border border-gray-200'}`}>{normalizeAppStatus(application.status)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(application.created_at).toLocaleDateString('nl-NL')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <select
                      value={normalizeAppStatus(application.status)}
                      onChange={(e) => onStatusChange(application.id, e.target.value as AppStatus)}
                      className="text-sm border border-[#4FA151]/30 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] bg-white min-w-[140px]"
                    >
                      {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
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
