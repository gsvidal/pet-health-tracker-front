import { useForm } from 'react-hook-form';
import type {
  VaccineFormRequest,
  VaccineFormState,
} from '../types/vaccine.type';
import { useEffect } from 'react';
import type { Vaccine } from '../models/vaccine.model';

interface UseVaccineFormProps {
  editingVaccine?: Vaccine | null;
  onSave: (data: VaccineFormRequest) => Promise<void>;
  onSuccess?: () => void;
}

export const useVaccineForm = ({
  editingVaccine,
  onSave,
  onSuccess,
}: UseVaccineFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
    watch,
  } = useForm<VaccineFormState>({
    mode: 'onChange',
    defaultValues: {
      vaccineName: '',
      dateAdministered: '',
      nextDue: '',
      veterinarian: '',
      manufacturer: '',
      lotNumber: '',
      notes: '',
    },
  });

  // Cargar datos de vacuna en modo edición
  useEffect(() => {
    if (editingVaccine) {
      setValue('vaccineName', editingVaccine.vaccineName);
      setValue(
        'dateAdministered',
        editingVaccine.dateAdministered.split('T')[0],
      );
      setValue('nextDue', editingVaccine.nextDue?.split('T')[0] || '');
      setValue('veterinarian', editingVaccine.veterinarian || '');
      setValue('manufacturer', editingVaccine.manufacturer || '');
      setValue('lotNumber', editingVaccine.lotNumber || '');
      setValue('notes', editingVaccine.notes || '');
    } else {
      reset();
    }
  }, [editingVaccine, setValue, reset]);

  const onSubmit = async (data: VaccineFormState) => {
    const formData: VaccineFormRequest = {
      vaccineName: data.vaccineName,
      dateAdministered: data.dateAdministered,
      nextDue: data.nextDue || null,
      veterinarian: data.veterinarian || null,
      manufacturer: data.manufacturer || null,
      lotNumber: data.lotNumber || null,
      notes: data.notes || null,
    };

    try {
      await onSave(formData);
      reset();
      onSuccess?.();
    } catch (err) {
      // Error ya manejado en el store o en el componente
      console.error('Error al guardar vacuna:', err);
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
