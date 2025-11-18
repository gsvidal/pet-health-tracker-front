import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/auth.store';
import type { RegisterRequest } from '../types/auth.type';

export const useRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const onSubmit = async (
    data: RegisterRequest & { confirmPassword: string },
  ) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    await registerUser({
      email: data.email,
      password: data.password,
    });
    reset();
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
    loading,
    serverError: error,
    success: isAuthenticated,
    onSubmit,
  };
};
