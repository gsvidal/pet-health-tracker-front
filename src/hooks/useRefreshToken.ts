import { useCallback } from 'react';
import { callApi } from '../utils/apiHelper';
import { useAuthStore } from '../store/auth.store';

export const useRefreshToken = () => {
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresh = useCallback(async () => {
    if (!refreshToken) return null;

    const { data, error } = await callApi<{
      access_token: string;
    }>({
      url: '/auth/refresh',
      method: 'POST',
      data: { refresh_token: refreshToken },
    });

    if (error || !data) {
      console.error('Error refrescando token:', error);
      return null;
    }

    setAuth({
      accessToken: data.access_token,
      isAuthenticated: true,
    });

    return data.access_token;
  }, [refreshToken, setAuth]);

  return refresh;
};
