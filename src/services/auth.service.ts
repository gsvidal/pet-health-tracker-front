import axios from 'axios';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RecoverPasswordResponse,
} from '../types/auth.type';

// URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL;
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
// Recuperación de contraseña
export const recoverPassword = async (
  email: string,
): Promise<RecoverPasswordResponse> => {
  const response = await axios.post<RecoverPasswordResponse>(
    `${API_URL}/request-password-reset`,
    { email },
  );
  return response.data;
};

// Objeto agrupado
export const authService = {
  register: registerUser,
  login: loginUser,
  recoverPassword,
};
