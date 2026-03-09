import { Link } from 'react-router-dom';
import type { AdminClientRow } from '../../services/adminClientsService';
import { Eye, Pencil, Ban, CheckCircle } from 'lucide-react';

interface ClientsTableProps {
  rows: AdminClientRow[];
  onToggleBlock: (employerId: string) => void;
}

export function ClientsTable({ rows, onToggleBlock }: ClientsTableProps) {
  return (
    <div className="rounded-xl border border-emerald-100 overflow-hidden shadow-md bg-white">
      <table className="min-w-full">
        <thead>
          <tr className="bg-[#4FA151] border-b border-[#3E8E45]">
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Bedrijfsnaam</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Contactpersoon</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Telefoon</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider"># Opdrachten</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Registratiedatum</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {rows.map(({ employer, profile, jobs_count }, idx) => {
            const isBlocked = profile.status === 'BLOCKED';
            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30';
            return (
              <tr key={employer.id} className={`${rowBg} hover:bg-emerald-50/50 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/opdrachtgevers/${employer.id}`}
                    className="text-sm font-semibold text-[#0F172A] hover:text-[#4FA151] hover:underline transition"
                  >
                    {employer.company_name || '—'}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{profile.full_name || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.phone || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{jobs_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(profile.created_at).toLocaleDateString('nl-NL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                      isBlocked ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isBlocked ? 'Geblokkeerd' : 'Actief'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/opdrachtgevers/${employer.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#4FA151] hover:bg-emerald-100 transition"
                      title="Bekijken"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/opdrachtgevers/${employer.id}?edit=1`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-emerald-100 hover:text-emerald-800 transition"
                      title="Bewerken"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleBlock(employer.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-emerald-100 transition"
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
