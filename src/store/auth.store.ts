import { create } from 'zustand';
import type { User } from '../models/user.model';
import { registerUser, loginUser } from '../services/authService';
import type { RegisterRequest, LoginRequest } from '../Types/authTypes';
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
      set({
        error: error || 'Error al registrar usuario',
        loading: false,
        isAuthenticated: false,
      });
      throw new Error(error || 'Error al registrar usuario');
    }

    // Usar adapter para transformar la data
    const user = adaptUserProfileToUser(userProfile);

    set({
      user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  },

  login: async (data: LoginRequest) => {
    set({ loading: true, error: null });

    const { data: tokenResponse, error } = await callApi(() => loginUser(data));

    if (error || !tokenResponse) {
      set({
        error: error || 'Error al iniciar sesión',
        loading: false,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      });
      throw new Error(error || 'Error al iniciar sesión');
    }

    set({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

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
  },

  clearError: () => {
    set({ error: null });
  },
}));
