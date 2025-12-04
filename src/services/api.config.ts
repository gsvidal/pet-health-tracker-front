import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Bandera para evitar loops infinitos en logout
let isHandlingLogout = false;

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
      // Evitar loops infinitos
      if (isHandlingLogout) {
        return Promise.reject(error);
      }

      const { accessToken, isAuthenticated } = useAuthStore.getState();

      // Solo hacer logout si hay un token almacenado (token expirado)
      // Si no hay token, es un error de credenciales en login/register (no hacer logout)
      // También verificar que no sea la ruta de logout la que está fallando
      const isLogoutEndpoint = error.config?.url?.includes('/logout');

      if (accessToken && isAuthenticated && !isLogoutEndpoint) {
        // Marcar que estamos manejando el logout para evitar loops
        isHandlingLogout = true;

        try {
          // Token expirado o inválido - hacer logout silencioso (sin llamar al servidor)
          const { clearAuth } = useAuthStore.getState();
          clearAuth();

          // Limpiar localStorage manualmente
          localStorage.removeItem('auth-storage');

          // Redirigir al home
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
        } catch (err) {
          console.error('Error en logout automático:', err);
        } finally {
          // Resetear la bandera después de un delay
          setTimeout(() => {
            isHandlingLogout = false;
          }, 1000);
        }
      }
      // Si no hay token, es un error de credenciales, no hacer nada
      // (el error se manejará en el componente/hook correspondiente)
    }
    return Promise.reject(error);
  },
);
