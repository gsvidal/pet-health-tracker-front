import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '../services/auth.service';
import type { AxiosError } from 'axios';
import { PUBLIC_ROUTES } from '../config/routes';
import i18n from '../i18n/config';

type RecoverPasswordForm = {
  email: string;
};
export const useRecoverPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecoverPasswordForm>();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const onSubmit = async (data: RecoverPasswordForm) => {
    setLoading(true);
    setServerError('');
    setSuccess(false);
    try {
      await requestPasswordReset(data.email);
      toast.success(i18n.t('toasts.auth.passwordResetRequested'));
      setSuccess(true);
      reset();
      // Redirigir a la página de confirmación
      navigate(PUBLIC_ROUTES.CHECK_EMAIL_RESET_PASSWORD, {
        state: { email: data.email },
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string; detail?: string }>;
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        i18n.t('toasts.auth.passwordResetRequestError');
      console.error('❌ Error en recuperación:', err);
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return {
    register,
    handleSubmit,
    errors,
    loading,
    serverError,
    success,
    onSubmit,
  };
};
