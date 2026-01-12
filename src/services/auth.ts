import { api } from './api';
import { storage } from '../utils/storage';
import type { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    storage.setToken(response.token);
    storage.setUser(response.user);
    return response;
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    storage.setToken(response.token);
    storage.setUser(response.user);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {});
    } finally {
      storage.clear();
    }
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  isAuthenticated(): boolean {
    return !!storage.getToken();
  },

  getStoredUser(): User | null {
    return storage.getUser();
  },
};
