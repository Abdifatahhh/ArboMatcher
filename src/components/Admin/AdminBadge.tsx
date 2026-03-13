type AdminBadgeVariant = 'success' | 'warning' | 'neutral' | 'danger' | 'info';

const variantClasses: Record<AdminBadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  neutral: 'bg-slate-50 text-slate-600 ring-slate-500/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20',
};

interface AdminBadgeProps {
  children: string;
  variant?: AdminBadgeVariant;
  className?: string;
  dot?: boolean;
}

export function AdminBadge({ children, variant = 'neutral', className = '', dot }: AdminBadgeProps) {
  const dotColor: Record<AdminBadgeVariant, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    neutral: 'bg-slate-400',
    danger: 'bg-red-500',
    info: 'bg-sky-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md ring-1 ring-inset px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`.trim()}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]}`} />}
      {children}
    </span>
  );
}
