import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/auth.store';
import type { LoginRequest } from '../types/auth.type';

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const loginUser = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const onSubmit = async (data: LoginRequest) => {
    await loginUser({
      email: data.email,
      password: data.password,
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    loading,
    serverError: error,
    success: isAuthenticated,
    onSubmit,
  };
};
