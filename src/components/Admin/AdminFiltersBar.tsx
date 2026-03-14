import type { ReactNode } from 'react';

interface AdminFiltersBarProps {
  children: ReactNode;
  className?: string;
}

export function AdminFiltersBar({ children, className = '' }: AdminFiltersBarProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 ${className}`.trim()}>
      <div className="flex flex-wrap items-end gap-3">{children}</div>
    </div>
  );
}

export const filterStyles = {
  label: 'block text-xs font-medium text-slate-600 mb-1',
  select: 'h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition',
  input: 'h-9 w-full px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition',
} as const;
