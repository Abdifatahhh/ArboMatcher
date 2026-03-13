import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

interface AdminBreadcrumbsProps {
  items: Crumb[];
}

export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-400">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
            {isLast || !item.to ? (
              <span className={isLast ? 'text-slate-700 font-medium' : ''}>{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-slate-600 transition-colors">{item.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
