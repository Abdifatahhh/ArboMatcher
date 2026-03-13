import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ page, totalPages, from, to, total, onPageChange }: AdminPaginationProps) {
  if (total === 0) return null;
  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{from}</span>–<span className="font-medium text-slate-700">{to}</span> van{' '}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Vorige pagina"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3 text-sm font-medium text-slate-700">{page} / {totalPages}</span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Volgende pagina"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
