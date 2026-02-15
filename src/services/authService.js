import { authApi } from '../api/authApi';

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(normalized);
  } catch {
    return null;
  }
}

function toMinimalUser(userLike) {
  if (!userLike || typeof userLike !== 'object') {
    return null;
  }

  return {
    id: userLike.id ?? userLike.userId ?? userLike.sub ?? null,
    fullName:
      userLike.fullName ?? userLike.name ?? userLike.userName ?? userLike.username ?? userLike.given_name ?? '',
    email: userLike.email ?? '',
  };
}

function decodeUserFromToken(token) {
  const payload = decodeJwtPayload(token);
  return toMinimalUser(payload);
}

async function login(payload) {
  const res = await authApi.login(payload);
  const token = res?.data?.token;
  const responseUser = res?.data;

  if (!token) {
    throw new Error('Token missing in login response');
  }

  return {
    token,
    user: toMinimalUser(responseUser) || decodeUserFromToken(token),
  };
}

export const authService = {
  login,
  register: (payload) => authApi.register(payload),
  decodeUserFromToken,
};
