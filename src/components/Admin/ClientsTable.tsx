import { Link } from 'react-router-dom';
import type { AdminClientRow } from '../../services/adminClientsService';
import { CLIENT_TYPE_LABELS } from '../../lib/schemas/adminClientsSchema';
import { Eye, Pencil, Ban, CheckCircle } from 'lucide-react';

interface ClientsTableProps {
  rows: AdminClientRow[];
  onToggleBlock: (employerId: string) => void;
}

export function ClientsTable({ rows, onToggleBlock }: ClientsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrijfsnaam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contactpersoon</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefoon</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Opdrachten</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registratiedatum</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map(({ employer, profile, jobs_count }) => {
            const typeKey = employer.client_type ?? 'direct';
            const typeLabel = CLIENT_TYPE_LABELS[typeKey] ?? typeKey;
            const isBlocked = profile.status === 'BLOCKED';
            return (
              <tr key={employer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/opdrachtgevers/${employer.id}`}
                    className="text-sm font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                  >
                    {employer.company_name || '—'}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.full_name || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.phone || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800">{typeLabel}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jobs_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(profile.created_at).toLocaleDateString('nl-NL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isBlocked ? 'Geblokkeerd' : 'Actief'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/opdrachtgevers/${employer.id}`}
                      className="inline-flex items-center gap-1 text-sm text-[#4FA151] hover:underline"
                      title="Bekijken"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/opdrachtgevers/${employer.id}?edit=1`}
                      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
                      title="Bewerken"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleBlock(employer.id)}
                      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
                      title={isBlocked ? 'Deblokkeren' : 'Blokkeren'}
                    >
                      {isBlocked ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Ban className="w-4 h-4 text-red-600" />}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
