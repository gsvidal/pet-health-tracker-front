import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { User } from '../models/user.model';

import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  TokenResponse,
} from '../types/auth.type';

import { callApi } from '../utils/apiHelper';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  mockLogin: () => void;

  verifyEmail: (token: string) => Promise<void>;
  setAuth: (data: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  register: async (data: RegisterRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi<RegisterResponse>({
      url: '/auth/register',
      method: 'POST',
      data,
    });

    if (error || !response) {
      const message = error || 'Error al registrar usuario';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    toast.success(
      'Registro exitoso. Revisa tu correo para verificar tu email 📩',
    );

    set({ loading: false, error: null });
  },

  login: async (data: LoginRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi<LoginResponse>({
      url: '/auth/login',
      method: 'POST',
      data,
    });

    if (error || !response) {
      const message = error || 'Credenciales incorrectas';
      toast.error(message);
      set({
        error: message,
        loading: false,
        isAuthenticated: false,
      });
      throw new Error(message);
    }

    set({
      user: {
        id: String(response.user.id),
        email: response.user.email,
        username: response.user.name,
        fullName: response.user.name,
        role: 'USER',
        createdAt: new Date().toISOString(),
      },
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    toast.success('Sesión iniciada correctamente ✔️');
  },

  refreshTokens: async () => {
    const refreshToken = get().refreshToken;
    if (!refreshToken) {
      console.warn('No hay refresh token disponible');
      return;
    }

    const { data, error } = await callApi<TokenResponse>({
      url: '/auth/refresh',
      method: 'POST',
      data: { refresh_token: refreshToken },
    });

    if (error || !data) {
      console.error('Error al refrescar token:', error);
      get().logout();
      return;
    }

    set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    toast('Sesión finalizada', { icon: '👋' });
  },

  clearError: () => set({ error: null }),

  mockLogin: () => {
    set({
      user: {
        id: 'dev-user',
        email: 'dev@example.com',
        username: 'devUser',
        fullName: 'Developer User',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      accessToken: 'dev-access-token',
      refreshToken: 'dev-refresh-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    toast.success('Sesión mock iniciada ✔️');
  },

  verifyEmail: async (token: string) => {
    set({ loading: true, error: null });

    const { data, error } = await callApi({
      url: `/auth/verify-email/${token}`,
      method: 'GET',
    });

    if (error || !data) {
      const message = error || 'Error al verificar email';
      set({ loading: false, error: message });
      throw new Error(message);
    }

    toast.success('Email verificado correctamente ✔️');
    set({ loading: false, error: null });
  },

  setAuth: (authData: Partial<AuthState>) =>
    set((state) => ({
      ...state,
      ...authData,
    })),
}));
