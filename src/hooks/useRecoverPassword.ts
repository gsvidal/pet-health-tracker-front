import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';

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
    setLoading(true);
    setServerError('');
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('📦 Datos enviados:', data);
      setSuccess(true);
      reset();
      toast.success('Se envió un correo para recuperar tu contraseña!');
    } catch (error: unknown) {
      console.error(error);
      setServerError('Error al procesar la solicitud');
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
