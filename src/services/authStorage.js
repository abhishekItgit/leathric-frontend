import { safeGet, safeRemove, safeSet } from '../lib/storage';

const TOKEN_KEY = 'leathric_token';
const USER_KEY = 'leathric_user';

const hasStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export function getToken() {
  if (!hasStorage()) {
    return null;
  }

  const token = window.localStorage.getItem(TOKEN_KEY);

  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }

  return token;
}

export function setToken(token) {
  if (!hasStorage()) {
    return;
  }

  if (typeof token !== 'string' || !token.trim()) {
    removeToken();
    return;
  }

  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // no-op
  }
}

export function removeToken() {
  safeRemove(TOKEN_KEY);
}

export function getUser() {
  return safeGet(USER_KEY);
}

export function setUser(user) {
  if (user == null) {
    removeUser();
    return;
  }

  safeSet(USER_KEY, user);
}

export function removeUser() {
  safeRemove(USER_KEY);
}

export const authStorage = {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
};
