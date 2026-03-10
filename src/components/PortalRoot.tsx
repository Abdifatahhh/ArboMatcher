import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

export function PortalRoot() {
  const { user, profile, loading } = useAuth();
  if (loading || !user) return <Login />;
  if (!profile) return <Login />;
  if (profile.role !== 'ADMIN' && profile.onboarding_completed !== true) return <Navigate to="/onboarding" replace />;
  switch (profile.role) {
    case 'professional':
      return <Navigate to="/arts/dashboard" replace />;
    case 'OPDRACHTGEVER':
      return <Navigate to="/opdrachtgever/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'onboarding':
      return <Navigate to="/onboarding" replace />;
    default:
      return <Login />;
  }
}
