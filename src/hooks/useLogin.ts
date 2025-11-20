import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/auth.store';
import type { LoginRequest } from '../types/auth.type';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../config/routes';

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const loginUser = useAuthStore((state) => state.login);
  const mockLoginUser = useAuthStore((state) => state.mockLogin);

  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PRIVATE_ROUTES.DASHBOARD);
    }
  });
  const onSubmit = async (data: LoginRequest) => {
    {
      /*await loginUser({
      email: data.email,
      password: data.password,
    });*/
    }
    {
      /*setTimeout(() => {
      mockLoginUser();
    }, 1500);*/
    }
    mockLoginUser();
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
