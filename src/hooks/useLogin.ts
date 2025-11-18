import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { loginUser } from '../services/auth.service';
import type { LoginRequest } from '../types/auth.type';

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
    try {
      setLoading(true);
      setServerError('');
      setSuccess(false);
      const response = await loginUser(data);
      // Guardado de token
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccess(true);
      reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || 'Error al iniciar sesión',
        );
      } else {
        setServerError('Error inesperado');
      }
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
