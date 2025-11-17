export const PUBLIC_ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  EXAMPLE: '/example',
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  // Future routes:
  // PETS: '/pets',
  // PET_DETAIL: '/pets/:id',
} as const;
