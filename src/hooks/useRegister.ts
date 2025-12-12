import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import type { RegisterRequest } from '../types/auth.type';
import { PUBLIC_ROUTES } from '../config/routes';

export const useRegister = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterRequest & { confirmPassword: string }>();
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const serverError = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearError = useAuthStore((state) => state.clearError);

  
  const [localError, setLocalError] = useState<string | null>(null);
  const onSubmit = async (
    data: RegisterRequest & { confirmPassword: string },
  ) => {
    setLocalError(null);
    clearError();
    if (data.password !== data.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    try {
      await registerUser({
        email: data.email,
        password: data.password,
      });
      reset();
      // Redirigir a la página de confirmación
      navigate(PUBLIC_ROUTES.CHECK_EMAIL_VERIFY, {
        state: { email: data.email },
      });
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };
  return {
    register,
    handleSubmit,
    errors,
    watch,
    loading,
    serverError,
    localError,
    success: isAuthenticated,
    onSubmit,
  };
};
