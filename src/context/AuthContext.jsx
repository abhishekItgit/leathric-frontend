import { createContext, useMemo, useState } from 'react';
import { authApi } from '../features/auth/api/authApi';
import { authStorage } from '../services/authStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getToken());
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);

    try {
      const data = await authApi.login(credentials);
      const resolvedToken = data?.token ?? data?.accessToken ?? data?.jwt ?? null;
      const resolvedUser = data?.user ?? null;

      authStorage.setToken(resolvedToken);
      authStorage.setUser(resolvedUser);

      setToken(resolvedToken);
      setUser(resolvedUser);

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
    authStorage.removeToken();
    authStorage.removeUser();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      login,
      logout,
      signup,
      isAuthenticated: Boolean(token),
      user,
      token,
      loading,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
