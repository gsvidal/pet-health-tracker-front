import axios from 'axios';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from '../Types/authTypes';

// URL base del backend (ajustar)
const API_URL = 'http://localhost:5000/api/auth';
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
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
  return response.data;
};
// Objeto agrupado
export const authService = {
  register: registerUser,
  login: loginUser,
};
