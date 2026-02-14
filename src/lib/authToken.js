const TOKEN_KEY = 'leathric_token';
const USER_KEY = 'leathric_user';

export const authToken = {
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },
  setToken(token, { persist = false } = {}) {
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    (persist ? sessionStorage : localStorage).removeItem(TOKEN_KEY);
  },
  clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser() {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser(user, { persist = false } = {}) {
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
    (persist ? sessionStorage : localStorage).removeItem(USER_KEY);
  },
  clearUser() {
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
