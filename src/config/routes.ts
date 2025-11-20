export const PUBLIC_ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  EXAMPLE: '/example',
  RECOVER_PSW: '/recover-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  // Future routes:
  // PETS: '/pets',
  // PET_DETAIL: '/pets/:id',
} as const;
