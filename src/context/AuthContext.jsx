import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../features/auth/api/authApi';
import { authStorage } from '../services/authStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getToken());
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    authStorage.removeToken();
    authStorage.removeUser();
    setToken(null);
    setUser(null);
  }, []);

  const hydrateUser = useCallback(async () => {
    const storedToken = authStorage.getToken();

    if (!storedToken) {
      setInitializing(false);
      return;
    }

    setToken(storedToken);

    try {
      const profile = await authApi.me();
      authStorage.setUser(profile);
      setUser(profile);
    } catch {
      logout();
    } finally {
      setInitializing(false);
    }
  }, [logout]);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleForcedLogout = () => {
      logout();
      setInitializing(false);
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const data = await authApi.login(credentials);
      const resolvedToken = data?.token ?? data?.accessToken ?? data?.jwt ?? null;

      authStorage.setToken(resolvedToken);
      setToken(resolvedToken);

      if (!resolvedToken) {
        throw new Error('Missing token from login response.');
      }

      const profile = await authApi.me();
      authStorage.setUser(profile);
      setUser(profile);

      return { ...data, user: profile };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (payload) => {
    setLoading(true);

    try {
      return await authApi.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      signup,
      refreshUser: hydrateUser,
      isAuthenticated: () => Boolean(token),
      user,
      token,
      loading,
      initializing,
    }),
    [token, user, loading, initializing, login, logout, signup, hydrateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
