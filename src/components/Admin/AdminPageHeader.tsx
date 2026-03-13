import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function AdminPageHeader({ title, description, icon: Icon, actions, meta }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-[1.75rem] font-semibold text-slate-900 tracking-tight flex items-center gap-2.5">
            {Icon && (
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 shrink-0">
                <Icon className="w-5 h-5 text-slate-700" />
              </span>
            )}
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {meta && <div className="mt-2">{meta}</div>}
    </div>
  );
}
