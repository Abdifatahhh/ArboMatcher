import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LazyLogin } from '../routes/lazyPages';

export function PortalRoot() {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <LazyLogin />;
  if (!profile) return <LazyLogin />;
  if (profile.role === 'onboarding' || (profile.role !== 'ADMIN' && profile.onboarding_completed !== true)) {
    return <Navigate to="/onboarding" replace />;
  }
  switch (profile.role) {
    case 'professional':
      return <Navigate to="/professional/dashboard" replace />;
    case 'ORGANISATIE':
      return <Navigate to="/organisatie/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <LazyLogin />;
  }
}
