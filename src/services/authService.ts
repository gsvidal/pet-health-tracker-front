import axios from 'axios';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  TokenResponse,
} from '../Types/authTypes';

// URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/auth`;

// Registro de usuario
export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_URL}/register`, {
    email: data.email,
    password: data.password,
  });
  return response.data;
};

// Inicio de sesión
export const loginUser = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await axios.post<TokenResponse>(`${API_URL}/login`, data);
  return response.data;
};
