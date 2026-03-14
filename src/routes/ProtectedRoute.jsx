import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../services/authStorage';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = authStorage.getToken();

  if (!token) {
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/signin?redirect=${encodeURIComponent(redirect)}`}
        replace
        state={{
          authMessage: 'Please login to add items to cart.',
          from: location,
        }}
      />
    );
  }

  return children ?? <Outlet />;
}
