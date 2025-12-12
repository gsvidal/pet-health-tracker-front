import { useAuthStore } from '../store/auth.store';

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const loading = useAuthStore((state) => state.loading);

  const handleLogout = async () => {
    await logout();
  };

  return { handleLogout, loading };
};
