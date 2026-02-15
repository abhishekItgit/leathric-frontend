import { authStorage } from '../services/authStorage';

export function requireAuth(navigate, redirectPath = '/') {
  const token = authStorage.getToken();

  if (!token) {
    navigate(`/signin?redirect=${encodeURIComponent(redirectPath)}`);
    return false;
  }

  return true;
}
