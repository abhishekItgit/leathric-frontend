import axios from 'axios';
import { authToken } from './authToken';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isBrowser = typeof window !== 'undefined';

function redirectToSignIn() {
  if (!isBrowser) {
    return;
  }

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
    const token = authToken.getToken();

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
      authToken.clearToken();
      authToken.clearUser();
      redirectToSignIn();
    }

    return Promise.reject(error);
  }
);
