import { createContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('leathric_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('leathric_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authService.login(credentials);
      const authToken = data.token;
      localStorage.setItem('leathric_token', authToken);
      localStorage.setItem('leathric_user', JSON.stringify(data.user));
      setToken(authToken);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await authService.register(payload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('leathric_token');
    localStorage.removeItem('leathric_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, login, signup, logout, isAuthenticated: Boolean(token) }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
