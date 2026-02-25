import axios from 'axios';
import { authStorage } from '../services/authStorage';

const isMeaningfulToken = (token) => {
  if (typeof token !== 'string') {
    return false;
  }

  const normalized = token.trim();
  return normalized !== '' && normalized !== 'null' && normalized !== 'undefined';
};

const getValidToken = () => {
  const token = authStorage.getToken();
  return isMeaningfulToken(token) ? token.trim() : null;
};

export const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getValidToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = getValidToken();

    if (token && (status === 401 || status === 403)) {
      authStorage.removeToken();
      authStorage.removeUser();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    return Promise.reject(error);
  }
);
