import api, { REFRESH_KEY, TOKEN_KEY, USER_KEY } from './api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    persistAuth(data);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    persistAuth(data);
    return data;
  },

  async refresh(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    persistAuth(data);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
    }
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};

function persistAuth(data: AuthResponse) {
  if (data.accessToken) localStorage.setItem(TOKEN_KEY, data.accessToken);
  if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export default authService;
