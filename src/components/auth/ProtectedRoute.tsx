import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuthBaseUrl, getLoginPath } from '../../config/portal';
import type { UserRole } from '../../lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const authBase = getAuthBaseUrl();

  if (!loading && !user) {
    if (authBase) {
      window.location.href = authBase + '/';
      return null;
    }
    return <Navigate to={getLoginPath()} replace />;
  }
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F1F5F9]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#0F172A]/20 border-t-[#4FA151]" />
      </div>
    );
  }

  const needsOnboarding = profile.onboarding_completed !== true && ['professional', 'ORGANISATIE', 'onboarding'].includes(profile.role);
  if (needsOnboarding && !allowedRoles?.includes('ADMIN') && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
