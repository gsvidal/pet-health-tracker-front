import type { User } from '../models/user.model';
import type { RegisterUserProfile } from '../types/auth.type';

/**
 * Adapta UserProfile del backend (snake_case) a User del frontend (camelCase)
 */
export function adaptUserProfileToUser(userProfile: RegisterUserProfile): User {
  return {
    id: userProfile.id,
    email: userProfile.email,
    username: userProfile.username,
    fullName: userProfile.full_name,
    role: userProfile.role,
    createdAt: userProfile.created_at,
  };
}
