import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RedirectToDashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
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
      return <Navigate to="/" replace />;
  }
}

export function RedirectToProfiel() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.role !== 'ADMIN' && profile.onboarding_completed !== true) return <Navigate to="/onboarding" replace />;
  switch (profile.role) {
    case 'professional':
      return <Navigate to="/arts/profiel" replace />;
    case 'OPDRACHTGEVER':
      return <Navigate to="/opdrachtgever/profiel" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'onboarding':
      return <Navigate to="/onboarding" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
