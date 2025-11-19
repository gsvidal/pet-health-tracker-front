import { useAuthStore } from '../store/auth.store';
import { useState } from 'react';

export const useVerifyEmail = () => {
  const verifyEmailAction = useAuthStore((state) => state.verifyEmail);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccess] = useState<string | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);

  const verifyEmail = async (token: string) => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await verifyEmailAction(token);
      setSuccess('Email verificado correctamente ✔️');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return { verifyEmail, loading, successMessage, errorMessage };
};
