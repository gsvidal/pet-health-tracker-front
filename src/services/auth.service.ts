import axios from 'axios';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ReqPasswordResetResponse,
} from '../types/auth.type';

// URL base del backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://pet-healthcare-back.onrender.com';
const API_URL = `${API_BASE_URL}/auth`;

// Registro de usuario
export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    `${API_URL}/register`,
    data,
  );
  return response.data;
};

// Inicio de sesión
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};
// Solicitar email de recuperación
export const requestPasswordReset = async (
  email: string,
): Promise<ReqPasswordResetResponse> => {
  const response = await axios.post<ReqPasswordResetResponse>(
    `${API_URL}/request-password-reset`,
    { email },
  );
  return response.data;
};
// Resetear contraseña con token
export const resetPassword = async (data: {
  token: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/reset-password`, data);
  return response.data;
};
// Verificacion de Email
export const verifyEmailRequest = (token: string) => {
  return axios.get(`/auth/verify-email?token=${token}`);
};
// Exportar objeto general con todos los servicios
export const authService = {
  register: registerUser,
  login: loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmailRequest,
};
