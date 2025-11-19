import axios from 'axios';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RequestPasswordReset,
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
// Solicitud cambio de contraseña
export const requestPasswordReset = async (
  email: string,
): Promise<RequestPasswordReset> => {
  const response = await axios.post<RequestPasswordReset>(
    `${API_URL}/request-password-reset`,
    { email },
  );
  return response.data;
};

// Objeto agrupado
export const authService = {
  register: registerUser,
  login: loginUser,
  requestPasswordReset,
};
