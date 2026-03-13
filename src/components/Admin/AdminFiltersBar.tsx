import type { ReactNode } from 'react';

interface AdminFiltersBarProps {
  children: ReactNode;
  className?: string;
}

export function AdminFiltersBar({ children, className = '' }: AdminFiltersBarProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 ${className}`.trim()}>
      <div className="flex flex-wrap items-end gap-4">{children}</div>
    </div>
  );
}
