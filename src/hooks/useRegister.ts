import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
export const useRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterFormData>();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerError('');
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Simulación exitosa (despues se reemplaza con el backend)
      console.log('📦 Datos enviados:', data);
      setSuccess(true);
      reset();
      toast.success('Registro exitoso, verifica tu correo');
    } catch (err: unknown) {
      console.error(err);
      setServerError('Ocurrió un error al registrar el usuario');
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
