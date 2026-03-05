import { Link } from 'react-router-dom';
import type { Profile } from '../../lib/types';
import { Pencil, Ban, CheckCircle } from 'lucide-react';

interface UsersTableProps {
  rows: Profile[];
  onToggleBlock: (profileId: string) => void;
}

export function UsersTable({ rows, onToggleBlock }: UsersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aangemaakt</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((profile) => {
            const isBlocked = profile.status === 'BLOCKED';
            return (
              <tr key={profile.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/gebruikers/${profile.id}`}
                    className="text-sm font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                  >
                    {profile.full_name || 'Geen naam'}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {profile.role}
                  </span>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(profile.created_at).toLocaleDateString('nl-NL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/gebruikers/${profile.id}`}
                      className="inline-flex items-center gap-1 text-sm text-[#4FA151] hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                      Bewerken
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleBlock(profile.id)}
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
