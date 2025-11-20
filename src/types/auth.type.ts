// ---------- Registro ----------
export interface RegisterRequest {
  email: string;
  password: string;
}
// El backend retorna directamente el perfil del usuario
export type RegisterResponse = RegisterUserProfile;

// -------- Inicio Sesion --------
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
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
  message: string | null;
  detail?: string;
}

// ----------- Tokens -----------
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
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
