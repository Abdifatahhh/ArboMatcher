import { Link } from 'react-router-dom';
import type { Profile } from '../../lib/types';
import { Pencil, Ban, CheckCircle } from 'lucide-react';

interface UsersTableProps {
  rows: Profile[];
  onToggleBlock: (profileId: string) => void;
}

export function UsersTable({ rows, onToggleBlock }: UsersTableProps) {
  return (
    <div className="rounded-xl border border-emerald-100 overflow-hidden shadow-md bg-white">
      <table className="min-w-full">
        <thead>
          <tr className="bg-[#4FA151] border-b border-[#3E8E45]">
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Naam</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">E-mail</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Aangemaakt</th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {rows.map((profile, idx) => {
            const isBlocked = profile.status === 'BLOCKED';
            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30';
            return (
              <tr key={profile.id} className={`${rowBg} hover:bg-emerald-50/50 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/admin/gebruikers/${profile.id}`} className="text-sm font-semibold text-[#0F172A] hover:text-[#4FA151] hover:underline transition">
                    {profile.full_name || 'Geen naam'}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800">{profile.role}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${isBlocked ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                    {isBlocked ? 'Geblokkeerd' : 'Actief'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(profile.created_at).toLocaleDateString('nl-NL')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/gebruikers/${profile.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#4FA151] hover:bg-emerald-100 transition"> <Pencil className="w-4 h-4" /> Bewerken </Link>
                    <button type="button" onClick={() => onToggleBlock(profile.id)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-emerald-100 transition" title={isBlocked ? 'Deblokkeren' : 'Blokkeren'}>
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
