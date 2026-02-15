import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { authStorage } from '../services/authStorage';

export const AuthContext = createContext(null);

const getSafeUser = (candidate) => {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const id = candidate.id ?? candidate.userId ?? null;
  const fullName = candidate.fullName ?? candidate.name ?? candidate.username ?? '';
  const email = candidate.email ?? '';

  return {
    id,
    fullName,
    email,
  };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authStorage.getToken());
  const [user, setUser] = useState(() => getSafeUser(authStorage.getUser()));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    authStorage.removeToken();
    authStorage.removeUser();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = getSafeUser(authStorage.getUser());

    if (!storedToken) {
      logout();
      setInitializing(false);
      return;
    }

    setToken(storedToken);
    setUser(storedUser || authService.decodeUserFromToken(storedToken));
    setInitializing(false);
  }, [logout]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleForcedLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    if (loading) {
      return null;
    }

    setLoading(true);
    try {
      const { token: nextToken, user: nextUser } = await authService.login(credentials);
      authStorage.setToken(nextToken);
      authStorage.setUser(nextUser);
      setToken(nextToken);
      setUser(getSafeUser(nextUser));
      return { token: nextToken, user: nextUser };
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const signup = useCallback(async (payload) => {
    setLoading(true);
    try {
      return await authService.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      initializing,
      isAuthenticated: Boolean(token),
      login,
      logout,
      signup,
    }),
    [user, token, loading, initializing, login, logout, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
