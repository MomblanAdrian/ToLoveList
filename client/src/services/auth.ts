import { apiRequest, setTokens, clearTokens } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@tolovelist/shared';
import { useAuthStore } from '../store/authStore';

function persistUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user));
  useAuthStore.getState().setUser(user);
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const result = await apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    persistUser(result.user);
    return result;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const result = await apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    persistUser(result.user);
    return result;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      clearTokens();
      localStorage.removeItem('user');
    }
  },
};
