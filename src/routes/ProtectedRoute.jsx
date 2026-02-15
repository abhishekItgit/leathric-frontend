import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return null;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}
