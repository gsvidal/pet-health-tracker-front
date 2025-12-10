export const PUBLIC_ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  EXAMPLE: '/example',
  RECOVER_PSW: '/request-password-reset',
  RESET_PSW: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  CREATE_PET: '/pets/create',
  NOTIFICATIONS: '/notifications',
  CALENDAR: '/calendar',
  // Future routes:
  // PETS: '/pets',
  PET_DETAIL: '/pets/:id',
} as const;
