import { useForm } from 'react-hook-form';
import { resetPassword } from '../services/auth.service';
import toast from 'react-hot-toast';
import { useState } from 'react';

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
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setServerError('');
    setSuccess(false);
    try {
      await resetPassword({ token, password: data.password });
      toast.success('Contraseña actualizada con éxito 🎉');
      reset();
      setSuccess(true);
    } catch {
      const msg = 'Error al actualizar la contraseña';
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
