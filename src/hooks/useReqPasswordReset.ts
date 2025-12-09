import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '../services/auth.service';
import type { AxiosError } from 'axios';
import { PUBLIC_ROUTES } from '../config/routes';

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
      const response = await requestPasswordReset(data.email);
      console.log('📩 Respuesta del backend:', response);
      toast.success('¡Revisa tu correo, enviamos un link!');
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
