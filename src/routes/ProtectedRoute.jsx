import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../services/authStorage';

export function ProtectedRoute() {
  const location = useLocation();
  const token = authStorage.getToken();

  if (!token) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/signin?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
