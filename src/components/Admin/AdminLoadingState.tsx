interface AdminLoadingStateProps {
  rows?: number;
  className?: string;
}

export function AdminLoadingState({ rows = 5, className = '' }: AdminLoadingStateProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden ${className}`.trim()}>
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-4 flex items-center gap-4">
            <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
            <div className="ml-auto h-3 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
