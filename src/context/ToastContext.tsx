import { createContext, useCallback, useContext, useState, useEffect, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  createdAt: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = DEFAULT_DURATION) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, message, duration, createdAt: Date.now() }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, duration?: number) => addToast('success', message, duration), [addToast]);
  const error = useCallback((message: string, duration?: number) => addToast('error', message, duration), [addToast]);
  const info = useCallback((message: string, duration?: number) => addToast('info', message, duration), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

const iconMap: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const styleMap: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: { bg: 'bg-white border-slate-200', icon: 'bg-emerald-500 text-white', bar: 'bg-emerald-500' },
  error: { bg: 'bg-white border-slate-200', icon: 'bg-red-500 text-white', bar: 'bg-red-500' },
  info: { bg: 'bg-white border-slate-200', icon: 'bg-blue-500 text-white', bar: 'bg-blue-500' },
};

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notificaties"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [progress, setProgress] = useState(100);
  const s = styleMap[toast.type];

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const interval = 50;
    const step = (interval / toast.duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) { clearInterval(timer); return 0; }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [toast.duration]);

  return (
    <div className={`pointer-events-auto rounded-xl shadow-lg border ${s.bg} overflow-hidden`}>
      <div className="flex items-start gap-3 p-3.5">
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.icon}`}>
          {iconMap[toast.type]}
        </span>
        <p className="text-sm font-medium text-slate-800 flex-1 pt-0.5">{toast.message}</p>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-slate-400 hover:text-slate-600 transition p-0.5"
          aria-label="Sluiten"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {toast.duration && toast.duration > 0 && (
        <div className="h-0.5 bg-slate-100">
          <div className={`h-full ${s.bar} transition-all duration-100 ease-linear`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
