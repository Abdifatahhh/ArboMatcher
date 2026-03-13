import type { ReactNode } from 'react';

interface AdminTableWrapperProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableWrapper({ children, className = '' }: AdminTableWrapperProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`.trim()}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
