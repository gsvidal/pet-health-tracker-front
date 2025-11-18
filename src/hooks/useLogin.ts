import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { LoginRequest } from '../types/auth.type';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginRequest>();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    setServerError('');
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('📦 Datos enviados (mock login):', data);
      setSuccess(true);
      reset();

      toast.success('Sesión iniciada correctamente ✔️');
    } catch (error: unknown) {
      console.error(error);
      setServerError('Error al iniciar sesión');
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
