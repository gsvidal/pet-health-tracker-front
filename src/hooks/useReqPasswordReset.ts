import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '../services/auth.service';
import type { AxiosError } from 'axios';

type RecoverPasswordForm = {
  email: string;
};
export const useRecoverPassword = () => {
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
      const response = await requestPasswordReset(data.email);
      console.log('📩 Respuesta del backend:', response);
      toast.success('¡Revisa tu correo, enviamos un link!');
      setSuccess(true);
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message?: string; detail?: string }>;
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Error al procesar la solicitud';
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
