import { authStorage } from '../services/authStorage';

export const authToken = {
  getToken() {
    return authStorage.getToken();
  },
  setToken(token) {
    authStorage.setToken(token);
  },
  clearToken() {
    authStorage.removeToken();
  },
  getUser() {
    return authStorage.getUser();
  },
  setUser(user) {
    authStorage.setUser(user);
  },
  clearUser() {
    authStorage.removeUser();
  },
};
