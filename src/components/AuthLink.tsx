import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuthBaseUrl } from '../config/portal';

const PORTAL_URL = 'https://portal.arbomatcher.nl/';

type AuthPath = '/login' | '/register';

interface AuthLinkProps {
  to: AuthPath;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onTouchStart?: () => void;
}

function prefetchPortal() {
  if (document.querySelector('link[data-portal-prefetch]')) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = PORTAL_URL;
  link.setAttribute('data-portal-prefetch', '');
  document.head.appendChild(link);
}

export function AuthLink({ to, className, children, onClick, onMouseEnter, onTouchStart }: AuthLinkProps) {
  const base = getAuthBaseUrl();
  const hovered = useRef(false);
  if (base) {
    const path = to === '/login' ? '/' : to;
    return (
      <a
        href={base + path}
        className={className}
        onClick={onClick}
        onMouseEnter={() => { onMouseEnter?.(); if (!hovered.current) { hovered.current = true; prefetchPortal(); } }}
        onTouchStart={onTouchStart}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} onClick={onClick} onMouseEnter={onMouseEnter} onTouchStart={onTouchStart}>
      {children}
    </Link>
  );
}
