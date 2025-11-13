import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
      // Simulación de espera de API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Validar contraseñas localmente
      if (data.password !== data.confirmPassword) {
        setServerError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
      // Simulación exitosa (despues se reemplaza con el backend)
      console.log('📦 Datos enviados:', data);
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('❌ Error en el registro:', error);
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
