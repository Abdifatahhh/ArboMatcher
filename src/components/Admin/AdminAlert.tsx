import type { ReactNode } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const config: Record<AlertVariant, { bg: string; icon: typeof Info; iconClass: string }> = {
  info: { bg: 'bg-sky-50 border-sky-200 text-sky-800', icon: Info, iconClass: 'text-sky-500' },
  success: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: CheckCircle, iconClass: 'text-emerald-500' },
  warning: { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: AlertTriangle, iconClass: 'text-amber-500' },
  error: { bg: 'bg-red-50 border-red-200 text-red-800', icon: XCircle, iconClass: 'text-red-500' },
};

interface AdminAlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function AdminAlert({ variant = 'info', children, onClose, className = '' }: AdminAlertProps) {
  const c = config[variant];
  const Icon = c.icon;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${c.bg} ${className}`.trim()}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${c.iconClass}`} />
      <div className="flex-1 min-w-0">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} className="shrink-0 p-0.5 rounded hover:bg-black/5 transition">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
