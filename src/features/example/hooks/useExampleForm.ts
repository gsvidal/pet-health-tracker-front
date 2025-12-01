import { useForm } from 'react-hook-form';
import { useExampleStore } from '../../../store/example.store';
import type { ContactFormRequest } from '../../../types/example.type';

/**
 * Hook personalizado para manejar el formulario de contacto
 * Solo se encarga de la lógica del formulario (validaciones, estado del form)
 */
export const useExampleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, touchedFields },
    watch,
    reset,
    setValue,
    getValues,
  } = useForm<ContactFormRequest>({
    mode: 'onChange', // Validación en tiempo real
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      acceptTerms: false,
    },
  });

  const { createSubmission, loading, error } = useExampleStore();

  // Watch para valores en tiempo real (útil para debugging)
  const watchedValues = watch();
  const watchedEmail = watch('email');

  // Ejemplo de setValue programático
  const fillExampleData = () => {
    setValue('name', 'Juan Pérez');
    setValue('email', 'juan@example.com');
    setValue('subject', 'Consulta de ejemplo');
    setValue('message', 'Este es un mensaje de ejemplo');
    setValue('acceptTerms', true);
  };

  const onSubmit = async (data: ContactFormRequest) => {
    await createSubmission(data);
    reset(); // Limpiar formulario después de enviar
  };

  return {
    // React Hook Form - Funciones principales
    register,
    handleSubmit,
    errors,
    isDirty,
    isValid,
    touchedFields,
    watch,
    reset,
    setValue,
    getValues,

    // Valores observados
    watchedValues,
    watchedEmail,

    // Store - Estado y acciones
    loading,
    serverError: error,
    onSubmit,

    // Helpers
    fillExampleData,
  };
};


