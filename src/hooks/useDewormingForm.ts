import { useForm } from 'react-hook-form';
import type {
  DewormingFormRequest,
  DewormingFormState,
} from '../types/deworming.type';
import { useEffect } from 'react';
import type { Deworming } from '../models/deworming.model';

interface UseDewormingFormProps {
  editingDeworming?: Deworming | null;
  onSave: (data: DewormingFormRequest) => Promise<void>;
  onSuccess?: () => void;
}

export const useDewormingForm = ({
  editingDeworming,
  onSave,
  onSuccess,
}: UseDewormingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
    watch,
  } = useForm<DewormingFormState>({
    mode: 'onChange',
    defaultValues: {
      medication: '',
      dateAdministered: '',
      nextDue: '',
      veterinarian: '',
      notes: '',
    },
  });

  // Cargar datos de desparasitación en modo edición
  useEffect(() => {
    if (editingDeworming) {
      setValue('medication', editingDeworming.medication || '');
      setValue(
        'dateAdministered',
        editingDeworming.dateAdministered.split('T')[0],
      );
      setValue('nextDue', editingDeworming.nextDue?.split('T')[0] || '');
      setValue('veterinarian', editingDeworming.veterinarian || '');
      setValue('notes', editingDeworming.notes || '');
    } else {
      reset();
    }
  }, [editingDeworming, setValue, reset]);

  const onSubmit = async (data: DewormingFormState) => {
    const formData: DewormingFormRequest = {
      medication: data.medication || null,
      dateAdministered: data.dateAdministered,
      nextDue: data.nextDue || null,
      veterinarian: data.veterinarian || null,
      notes: data.notes || null,
    };

    try {
      await onSave(formData);
      reset();
      onSuccess?.();
    } catch (err) {
      // Error ya manejado en el store o en el componente
      console.error('Error al guardar desparasitación:', err);
    }
  };

  const handleCancel = () => {
    reset();
    onSuccess?.();
  };

  return {
    register,
    handleSubmit,
    errors,
    isDirty,
    isValid,
    onSubmit,
    handleCancel,
    watch,
  };
};
