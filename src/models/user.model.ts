export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  role: string;
  createdAt: string;
  isActive?: boolean;
  emailVerified?: boolean;
  phone?: string | null;
  timezone?: string | null;
}
