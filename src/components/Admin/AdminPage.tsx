import type { ReactNode } from 'react';

interface AdminPageProps {
  children: ReactNode;
  className?: string;
}

export function AdminPage({ children, className = '' }: AdminPageProps) {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 ${className}`.trim()}>
      {children}
    </div>
  );
}
