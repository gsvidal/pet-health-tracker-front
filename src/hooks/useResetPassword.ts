import { useForm } from 'react-hook-form';
import { resetPassword } from '../services/auth.service';
import toast from 'react-hot-toast';
import { useState } from 'react';
import i18n from '../i18n/config';

export type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};
export const useResetPassword = (token: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ResetPasswordForm>();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const onSubmit = async (data: ResetPasswordForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error(i18n.t('toasts.auth.passwordMismatch'));
      return;
    }
    setLoading(true);
    setServerError('');
    setSuccess(false);
    try {
      await resetPassword({ token, password: data.password });
      toast.success(i18n.t('toasts.auth.passwordReset'));
      reset();
      setSuccess(true);
    } catch {
      const msg = i18n.t('toasts.auth.passwordResetError');
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };
  return {
    register,
    handleSubmit,
    errors,
    watch,
    loading,
    serverError,
    success,
    onSubmit,
  };
};
