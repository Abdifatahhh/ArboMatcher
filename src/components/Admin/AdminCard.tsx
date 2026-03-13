import type { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  noPadding?: boolean;
}

export function AdminCard({ children, title, className = '', noPadding }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`.trim()}>
      {title && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
