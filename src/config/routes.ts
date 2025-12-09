export const PUBLIC_ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  EXAMPLE: '/example',
  RECOVER_PSW: '/request-password-reset',
  RESET_PSW: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  CHECK_EMAIL_RESET_PASSWORD: '/check-email-reset-password',
  CHECK_EMAIL_VERIFY: '/check-email-verify',
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  CREATE_PET: '/pets/create',
  // Future routes:
  // PETS: '/pets',
  PET_DETAIL: '/pets/:id',
  ACTIVITY_LOGS: '/activity-logs',
} as const;
