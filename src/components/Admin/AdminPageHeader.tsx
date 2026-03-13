import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export function AdminPageHeader({ title, description, icon: Icon, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 flex items-center gap-2">
          {Icon && <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-emerald-600 shrink-0" />}
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
