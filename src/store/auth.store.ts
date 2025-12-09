import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  // TODO: add tokenType and expiresIn (from Login response)

  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  mockLogin: () => void;
  verifyEmail: (token: string) => Promise<void>;
  setAuth: (data: Partial<AuthState>) => void;
  clearAuth: () => void;
  getUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
        // console.log('Respuesta del backend:', response);

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
        // console.log('response: ', response);
        // console.log('error: ', error);

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

        const { error } = await callApi(() => authService.verifyEmail(token));

        // Solo verificar error, no data (porque el backend retorna null en éxito)
        if (error) {
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
        let logoutSuccess = false;

        // Intentar logout en el servidor PRIMERO (antes de limpiar el estado)
        // para que el interceptor pueda agregar el token a la request
        if (accessToken) {
          try {
            await callApi(() => authService.logout());
            logoutSuccess = true;
          } catch (err) {
            // Ignorar errores en logout (puede que el token ya sea inválido)
            console.warn(
              'Error al cerrar sesión en el servidor (ignorado):',
              err,
            );
            logoutSuccess = false;
          }
        } else {
          // Si no hay token, considerar logout exitoso (ya estaba deslogueado)
          logoutSuccess = true;
        }

        // Limpiar estado después de intentar logout en el servidor
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        // Limpiar localStorage
        localStorage.removeItem('auth-storage');

        set({
          loading: false,
          error: null,
        });

        // Solo mostrar toast de éxito si el logout fue exitoso
        if (logoutSuccess) {
          toast.success('Sesión cerrada correctamente 👋');
        }
      },

      setAuth: (authData: Partial<AuthState>) =>
        set((state) => ({
          ...state,
          ...authData,
        })),

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      getUserData: async () => {
        set({ loading: true, error: null });

        const { data: user, error } = await callApi(() =>
          authService.getUserData(),
        );

        if (error || !user) {
          const message = error || 'Error al obtener datos del usuario';
          console.error('Error al obtener datos del usuario:', error);
          set({ loading: false, error: message });
          throw new Error(message);
        }

        set({
          user,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage', // Clave en localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Solo estos campos se persisten (excluye loading, error)
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
