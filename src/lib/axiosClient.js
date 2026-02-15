import axios from 'axios';
import { authStorage } from '../services/authStorage';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isBrowser = typeof window !== 'undefined';

function clearSessionAndRedirect() {
  authStorage.removeToken();
  authStorage.removeUser();

  if (!isBrowser) {
    return;
  }

  window.dispatchEvent(new Event('auth:logout'));

  const { pathname, search } = window.location;
  const currentPath = `${pathname}${search}`;
  const signinPath = pathname === '/signin' ? '/signin' : `/signin?redirect=${encodeURIComponent(currentPath)}`;

  if (window.location.pathname !== '/signin') {
    window.history.replaceState({}, '', signinPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearSessionAndRedirect();
    }

    return Promise.reject(error);
  }
);
