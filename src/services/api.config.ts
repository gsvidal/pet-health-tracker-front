import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Instancia configurada de axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para manejar errores globales (tokens vencidos)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Detectar token vencido o inválido (401 Unauthorized)
    if (error.response?.status === 401) {
      const { accessToken, isAuthenticated, logout } = useAuthStore.getState();

      // Solo hacer logout si hay un token almacenado (token expirado)
      // Si no hay token, es un error de credenciales en login/register (no hacer logout)
      if (accessToken && isAuthenticated) {
        // Token expirado o inválido - hacer logout forzado
        console.log('token expirado, loging out');
        await logout();

        // Redirigir al home después de un breve delay para que el logout se complete
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      // Si no hay token, es un error de credenciales, no hacer nada
      // (el error se manejará en el componente/hook correspondiente)
    }
    return Promise.reject(error);
  },
);
