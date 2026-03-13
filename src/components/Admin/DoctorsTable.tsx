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
    <div className="rounded-xl border border-emerald-100 overflow-hidden shadow-md bg-white">
      <table className="min-w-full">
        <thead>
          <tr className="bg-[#4FA151] border-b border-[#3E8E45]">
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Naam</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Telefoon</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">BIG</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Verificatie</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider"># Sollicitaties</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Registratiedatum</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {rows.map(({ doctor, profile, applications_count }, idx) => {
            const isBlocked = profile.status === 'BLOCKED';
            const verLabel = VERIFICATION_LABELS[doctor.verification_status] ?? doctor.verification_status;
            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30';
            return (
              <tr key={doctor.id} className={`${rowBg} hover:bg-emerald-50/50 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/professionals/${doctor.id}`} className="text-sm font-semibold text-[#0F172A] hover:text-[#4FA151] hover:underline transition">
                      {profile.full_name || '—'}
                    </Link>
                    {(doctor as { doctor_plan?: string }).doctor_plan === 'PRO' && <Crown className="w-4 h-4 text-amber-500" title="PRO" />}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.phone || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">{doctor.big_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                    doctor.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    doctor.verification_status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    doctor.verification_status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    <span className="inline-flex items-center gap-1"><Shield className="w-3 h-3" />{verLabel}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{applications_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(profile.created_at).toLocaleDateString('nl-NL')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${isBlocked ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                    {isBlocked ? 'Geblokkeerd' : 'Actief'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/professionals/${doctor.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#4FA151] hover:bg-emerald-100 transition" title="Bekijken"><Eye className="w-4 h-4" /></Link>
                    <Link to={`/admin/professionals/${doctor.id}?edit=1`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-emerald-100 hover:text-emerald-800 transition" title="Bewerken"><Pencil className="w-4 h-4" /></Link>
                    <button type="button" onClick={() => onToggleBlock(doctor.id)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-emerald-100 transition" title={isBlocked ? 'Deblokkeren' : 'Blokkeren'}>
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
