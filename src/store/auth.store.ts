import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { User } from '../models/user.model';

import type { RegisterRequest, LoginRequest } from '../types/auth.type';

import { callApi } from '../utils/apiHelper';
import * as authService from '../services/auth.service';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
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

    const { data: response, error } = await callApi(() =>
      authService.register(data),
    );

    // TEMPORAL: Ver qué envía el backend
    console.log('Respuesta del backend:', response);

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

    const { data: response, error } = await callApi(() =>
      authService.login(data),
    );

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

    const { data, error } = await callApi(() =>
      authService.refreshTokens(refreshToken),
    );

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

  clearError: () => set({ error: null }),

  mockLogin: () => {
    set({
      user: {
        id: 'dev-user',
        email: 'miltonfruizok@outlook.es',
        username: 'milton',
        fullName: 'Milton Ruiz',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
      accessToken: 'dev-access-token',
      refreshToken: 'dev-refresh-token',
      //isAuthenticated: true,
      loading: true,
      error: null,
    });
    setTimeout(() => {
      set({
        loading: false,
        isAuthenticated: true,
      });
      toast.success('Sesión mock iniciada ✔️');
    }, 3000);

    // toast.success('Sesión mock iniciada ✔️');
  },

  verifyEmail: async (token: string) => {
    set({ loading: true, error: null });

    const { data, error } = await callApi(() => authService.verifyEmail(token));

    if (error || !data) {
      const message = error || 'Error al verificar email';
      set({ loading: false, error: message });
      throw new Error(message);
    }

    toast.success('Email verificado correctamente ✔️');
    set({ loading: false, error: null });
  },

  logout: async () => {
    set({ loading: true, error: null });
    const accessToken = get().accessToken;
    if (accessToken) {
      try {
        await callApi(() => authService.logout());
      } catch (err) {
        // Ignorar errores en logout (puede que el token ya sea inválido)
        console.warn('Error al cerrar sesión en el servidor:', err);
      }
    }
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    toast.success('Sesión cerrada correctamente 👋');
  },

  setAuth: (authData: Partial<AuthState>) =>
    set((state) => ({
      ...state,
      ...authData,
    })),
}));
