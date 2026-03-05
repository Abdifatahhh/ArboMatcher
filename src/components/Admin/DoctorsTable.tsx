import { Link } from 'react-router-dom';
import type { AdminDoctorRow } from '../../services/adminDoctorsService';
import { Eye, Pencil, Ban, CheckCircle, Shield, Crown } from 'lucide-react';

const VERIFICATION_LABELS: Record<string, string> = {
  VERIFIED: 'Geverifieerd',
  PENDING: 'In behandeling',
  REJECTED: 'Afgewezen',
  UNVERIFIED: 'Niet geverifieerd',
};

interface DoctorsTableProps {
  rows: AdminDoctorRow[];
  onToggleBlock: (doctorId: string) => void;
}

export function DoctorsTable({ rows, onToggleBlock }: DoctorsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefoon</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BIG</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verificatie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Sollicitaties</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registratiedatum</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map(({ doctor, profile, applications_count }) => {
            const isBlocked = profile.status === 'BLOCKED';
            const verLabel = VERIFICATION_LABELS[doctor.verification_status] ?? doctor.verification_status;
            return (
              <tr key={doctor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/artsen/${doctor.id}`}
                      className="text-sm font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                    >
                      {profile.full_name || '—'}
                    </Link>
                    {doctor.premium_status && (
                      <Crown className="w-4 h-4 text-amber-500" title="Premium" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.phone || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.big_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${
                      doctor.verification_status === 'VERIFIED'
                        ? 'bg-green-100 text-green-800'
                        : doctor.verification_status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : doctor.verification_status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {verLabel}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applications_count}</td>
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
                      to={`/admin/artsen/${doctor.id}`}
                      className="inline-flex items-center gap-1 text-sm text-[#4FA151] hover:underline"
                      title="Bekijken"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/artsen/${doctor.id}?edit=1`}
                      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
                      title="Bewerken"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleBlock(doctor.id)}
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
