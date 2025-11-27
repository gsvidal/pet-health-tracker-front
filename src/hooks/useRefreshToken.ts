// TODO: descomentar todo esto se comento por temas de build

import { useCallback } from 'react';
import { callApi } from '../utils/apiHelper';
import { useAuthStore } from '../store/auth.store';
import { refreshTokens } from '../services/auth.service';

export const useRefreshToken = () => {
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresh = useCallback(async () => {
    if (!refreshToken) return null;

    const { data, error } = await callApi(() => refreshTokens(refreshToken));

    if (error || !data) {
      console.error('Error refrescando token:', error);
      return null;
    }

    setAuth({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      isAuthenticated: true,
    });

    return data.access_token;
  }, [refreshToken, setAuth]);

  return refresh;
};
