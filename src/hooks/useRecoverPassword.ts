import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
// import axios from 'axios';  // <- Lo activamos cuando el backend esté listo

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
      /** ------------------------------------------------------------------
       *  🔌 SIMULACIÓN TEMPORAL (quitar cuando el backend esté listo)
       * ------------------------------------------------------------------*/
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('📦 Datos enviados:', data);

      /** ------------------------------------------------------------------
       *  🔌 ACÁ VA EL BACKEND (cuando esté terminado)
       *  Ejemplo:
       *  const resp = await axios.post(`${API_URL}/auth/recover-password`, data);
       * ------------------------------------------------------------------*/

      setSuccess(true);
      reset();
      toast.success('Se envió un correo para recuperar tu contraseña!');
    } catch (error: unknown) {
      console.error(error);
      setServerError('Error al procesar la solicitud');
      toast.error('No se pudo procesar la solicitud');
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
