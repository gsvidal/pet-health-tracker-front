import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { authService } from '../services/auth.service';
import type { AxiosError } from 'axios';
import type { ReqPasswordResetResponse } from '../types/auth.type';

type RecoverRequest = {
  email: string;
};
export const useRecoverPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecoverRequest>();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const onSubmit = async (data: RecoverRequest) => {
    try {
      setLoading(true);
      setServerError('');
      setSuccess(false);
      await authService.requestPasswordReset(data.email);
      setSuccess(true);
      reset();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ReqPasswordResetResponse>;
      setServerError(
        axiosError.response?.data?.message ||
          'No pudimos enviar el correo. Intentá nuevamente.',
      );
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
