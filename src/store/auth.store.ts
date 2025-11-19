import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { User } from '../models/user.model';
import {
  registerUser,
  loginUser,
  verifyEmailRequest,
} from '../services/auth.service';
import type { RegisterRequest, LoginRequest } from '../types/auth.type';
import { adaptUserProfileToUser } from '../adapters/user/user.adapter';
import { callApi } from '../utils/apiHelper';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Acciones
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  mockLogin: () => void;

  verifyEmail: (token: string) => Promise<void>; // <-- AGREGAR ESTO
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  register: async (data: RegisterRequest) => {
    set({ loading: true, error: null });

    const { data: userProfile, error } = await callApi(() =>
      registerUser(data),
    );

    if (error || !userProfile) {
      const message = error || 'Error al registrar usuario';
      toast.error(message);
      set({
        error: message,
        loading: false,
        isAuthenticated: false,
      });
      throw new Error(message);
    }

    // Usar adapter para transformar la data
    const user = adaptUserProfileToUser(userProfile);

    set({
      user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
    toast.success('Usuario registrado correctamente ✨');
  },

  login: async (data: LoginRequest) => {
    set({ loading: true, error: null });

    const { data: tokenResponse, error } = await callApi(() => loginUser(data));

    if (error || !tokenResponse) {
      const message = error || 'Error al iniciar sesión';
      toast.error(message);
      set({
        error: message,
        loading: false,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      });
      throw new Error(message);
    }

    set({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    toast.success('Sesión iniciada correctamente ✔️');
    // TODO: Obtener perfil del usuario con /auth/me usando el accessToken
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

  clearError: () => {
    set({ error: null });
  },

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

    toast.success('Sesión mock iniciada correctamente ✔️');
  },

  verifyEmail: async (token: string) => {
    set({ loading: true, error: null });

    const { data, error } = await callApi(() => verifyEmailRequest(token));

    if (error || !data) {
      const message = error || 'Error al verificar email';
      set({ loading: false, error: message });
      throw new Error(message);
    }

    toast.success('Email verificado correctamente ✔️');

    set({ loading: false, error: null });
  },
}));
