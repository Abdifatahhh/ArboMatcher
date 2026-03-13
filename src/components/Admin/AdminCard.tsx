import type { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AdminCard({ children, title, subtitle, actions, className = '', noPadding }: AdminCardProps) {
  const hasHeader = title || subtitle || actions;
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`.trim()}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-100">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-slate-800 leading-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
