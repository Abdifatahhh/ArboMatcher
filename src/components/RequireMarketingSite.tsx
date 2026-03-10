import { Navigate } from 'react-router-dom';
import { isPortal } from '../config/portal';

export function RequireMarketingSite({ children }: { children: React.ReactNode }) {
  if (isPortal()) return <Navigate to="/" replace />;
  return <>{children}</>;
}
