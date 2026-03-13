type AdminBadgeVariant = 'success' | 'warning' | 'neutral' | 'danger' | 'info';

const variantClasses: Record<AdminBadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-slate-100 text-slate-700 border-slate-200',
};

interface AdminBadgeProps {
  children: string;
  variant?: AdminBadgeVariant;
  className?: string;
}

export function AdminBadge({ children, variant = 'neutral', className = '' }: AdminBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
