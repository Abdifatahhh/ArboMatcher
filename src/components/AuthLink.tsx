import { Link } from 'react-router-dom';
import { getAuthBaseUrl } from '../config/portal';

type AuthPath = '/login' | '/register';

interface AuthLinkProps {
  to: AuthPath;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function AuthLink({ to, className, children, onClick }: AuthLinkProps) {
  const base = getAuthBaseUrl();
  if (base) {
    return (
      <a href={base + to} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
