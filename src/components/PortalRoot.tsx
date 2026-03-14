import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

export function PortalRoot() {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Login />;
  if (!profile) return <Login />;
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
      return <Login />;
  }
}
