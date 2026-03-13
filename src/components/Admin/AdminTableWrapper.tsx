import type { ReactNode } from 'react';

interface AdminTableWrapperProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableWrapper({ children, className = '' }: AdminTableWrapperProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden ${className}`.trim()}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export const tableStyles = {
  table: 'min-w-full divide-y divide-slate-200',
  thead: 'bg-slate-50',
  th: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider',
  thRight: 'px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider',
  td: 'px-4 py-3.5 whitespace-nowrap text-sm text-slate-700',
  tdWrap: 'px-4 py-3.5 text-sm text-slate-700',
  row: 'border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors',
  link: 'font-medium text-slate-900 hover:text-blue-600 transition-colors',
  secondary: 'text-xs text-slate-500',
  actionBtn: 'inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors',
} as const;
