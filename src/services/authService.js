import { authApi } from '../api/authApi';

export const authService = {
  login: (payload) => authApi.login(payload),
  register: (payload) => authApi.register(payload),
};
