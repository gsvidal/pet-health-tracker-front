// ---------- Registro ----------
export interface RegisterRequest {
  email: string;
  password: string;
}
export interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
// -------- Inicio Sesion --------
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
// --- Solicitud cambio de contraseña ----
export interface RecoverPasswordRequest {
  email: string;
}
export interface ReqPasswordResetResponse {
  message: string;
}
// ----------- Tokens -----------
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
// ----------- Perfil -----------
export interface RegisterUserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  timezone: string | null;
  role: string;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
}
