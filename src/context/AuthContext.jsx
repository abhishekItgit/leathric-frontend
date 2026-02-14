import { createContext, useMemo, useState } from 'react';
import { authApi } from '../features/auth/api/authApi';
import { authToken } from '../lib/authToken';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authToken.getToken());
  const [user, setUser] = useState(() => authToken.getUser());
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      authToken.setToken(data.token, { persist: true });
      authToken.setUser(data.user, { persist: true });
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      return await authApi.register(payload);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authToken.clearToken();
    authToken.clearUser();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, login, signup, logout, isAuthenticated: Boolean(token) }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
