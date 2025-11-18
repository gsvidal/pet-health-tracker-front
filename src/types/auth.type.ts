
export interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
// Login - solo email y password
export interface LoginRequest {
  email: string;
  password: string;
}

// Register - solo email y password
export interface RegisterRequest {
  email: string;
  password: string;
}

// Respuesta de tokens
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Respuesta de registro (UserProfile según la API)
export interface RegisterResponse {
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
export interface RecoverPasswordResponse {
  message: string;
}
