import type { ReactNode } from 'react';

interface AdminPageProps {
  children: ReactNode;
  className?: string;
}

export function AdminPage({ children, className = '' }: AdminPageProps) {
  return (
    <div className={`p-6 lg:p-8 max-w-[1600px] mx-auto ${className}`.trim()}>
      {children}
    </div>
  );
}
