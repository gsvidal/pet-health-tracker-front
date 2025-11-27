import { apiClient } from './api.config';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ReqPassResetResponse,
  RegisterUserProfile,
  TokenResponse,
} from '../types/auth.type';
import type { User } from '../models/user.model';
import { adaptUserProfileToUser } from '../adapters/user.adapter';

const AUTH_ENDPOINT = '/auth';

/**
 * Registra un nuevo usuario
 */
export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    `${AUTH_ENDPOINT}/register`,
    data,
  );
  return response.data;
};

/**
 * Inicia sesión
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log('login data auth service: ', data);
  const response = await apiClient.post<LoginResponse>(
    `${AUTH_ENDPOINT}/login`,
    data,
  );
  return response.data;
};

/**
 * Refresca los tokens
 */
export const refreshTokens = async (
  refreshToken: string,
): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>(
    `${AUTH_ENDPOINT}/refresh`,
    { refresh_token: refreshToken },
  );
  return response.data;
};

/**
 * Cierra sesión
 */
export const logout = async (): Promise<void> => {
  await apiClient.post(`${AUTH_ENDPOINT}/logout`);
};

/**
 * Solicita recuperación de contraseña
 */
export const requestPasswordReset = async (
  email: string,
): Promise<ReqPassResetResponse> => {
  const response = await apiClient.post<ReqPassResetResponse>(
    `${AUTH_ENDPOINT}/request-password-reset`,
    { email },
  );
  return response.data;
};

/**
 * Resetea la contraseña con token
 */
export const resetPassword = async (data: {
  token: string;
  password: string;
}): Promise<void> => {
  await apiClient.post(`${AUTH_ENDPOINT}/reset-password`, data);
};

/**
 * Verifica el email con token
 */
export const verifyEmail = async (token: string): Promise<void> => {
  await apiClient.post(`${AUTH_ENDPOINT}/verify-email`, { token });
};

/**
 * Obtiene los datos del usuario autenticado
 */
export const getUserData = async (): Promise<User> => {
  const response = await apiClient.get<RegisterUserProfile>(
    `${AUTH_ENDPOINT}/me`,
  );
  return adaptUserProfileToUser(response.data);
};
