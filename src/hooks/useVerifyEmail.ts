import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/auth.store';
import { useState, useRef } from 'react';

export const useVerifyEmail = () => {
  const { t } = useTranslation();
  const verifyEmailAction = useAuthStore((state) => state.verifyEmail);
  const isVerifyingRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccess] = useState<string | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);

  const verifyEmail = async (token: string) => {
    // Evitar múltiples ejecuciones simultáneas
    if (isVerifyingRef.current) {
      return;
    }

    // Limpiar estados previos completamente
    setSuccess(null);
    setError(null);
    setLoading(true);
    isVerifyingRef.current = true;

    try {
      await verifyEmailAction(token);
      // Si llegamos aquí sin excepción, fue exitoso
      // El toast ya se muestra en el store, solo necesitamos el mensaje para la UI
      setSuccess(t('toasts.auth.emailVerified'));
      // Forzar limpieza de error por si acaso
      setError(null);
    } catch (err) {
      // Si hay error, limpiar éxito completamente y establecer error
      setSuccess(null);
      const errorMsg = err instanceof Error ? err.message : t('common.error');
      setError(errorMsg);
      // No mostrar toast aquí porque el store ya lo maneja
    } finally {
      setLoading(false);
      isVerifyingRef.current = false;
    }
  };

  return { verifyEmail, loading, successMessage, errorMessage };
};
