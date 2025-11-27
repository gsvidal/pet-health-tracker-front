export const PUBLIC_ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  EXAMPLE: '/example',
  RECOVER_PSW: '/request-password-reset',
  VERIFY_EMAIL: '/verify-email',
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  CREATE_PET: '/pets/create',
  // Future routes:
  // PETS: '/pets',
  PET_DETAIL: '/pets/:id',
} as const;
