import { useForm } from 'react-hook-form';
import type {
  VetVisitFormRequest,
  VetVisitFormState,
} from '../types/vetVisit.type';
import { useEffect, useRef } from 'react';
import type { VetVisit } from '../models/vetVisit.model';
import { combineDateAndTimeToISO } from '../utils/dateUtils';

interface UseVetVisitFormProps {
  editingVetVisit?: VetVisit | null;
  onSave: (data: VetVisitFormRequest) => Promise<void>;
  onSuccess?: () => void;
}

export const useVetVisitForm = ({
  editingVetVisit,
  onSave,
  onSuccess,
}: UseVetVisitFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
    watch,
  } = useForm<VetVisitFormState>({
    mode: 'onChange',
    defaultValues: {
      visitDate: '',
      visitHour: '',
      reason: '',
      diagnosis: '',
      treatment: '',
      followUpDate: '',
      followUpHour: '',
      veterinarian: '',
    },
  });

  const previousEditingVetVisitRef = useRef<VetVisit | null | undefined>(
    editingVetVisit,
  );

  // Cargar datos de visita en modo edición
  useEffect(() => {
    const previousEditingVetVisit = previousEditingVetVisitRef.current;
    previousEditingVetVisitRef.current = editingVetVisit;

    // Solo resetear si cambió de un objeto a null (de edición a creación)
    if (previousEditingVetVisit && !editingVetVisit) {
      reset();
      return;
    }

    if (editingVetVisit) {
      const visitDate = new Date(editingVetVisit.visitDate);
      // Extraer fecha y hora en zona horaria local (no UTC)
      const year = visitDate.getFullYear();
      const month = String(visitDate.getMonth() + 1).padStart(2, '0');
      const day = String(visitDate.getDate()).padStart(2, '0');
      const hours = String(visitDate.getHours()).padStart(2, '0');
      const minutes = String(visitDate.getMinutes()).padStart(2, '0');

      setValue('visitDate', `${year}-${month}-${day}`);
      setValue('visitHour', `${hours}:${minutes}`);

      setValue('reason', editingVetVisit.reason || '');
      setValue('diagnosis', editingVetVisit.diagnosis || '');
      setValue('treatment', editingVetVisit.treatment || '');

      if (editingVetVisit.followUpDate) {
        const followUpDate = new Date(editingVetVisit.followUpDate);
        // Extraer fecha y hora en zona horaria local (no UTC)
        const followUpYear = followUpDate.getFullYear();
        const followUpMonth = String(followUpDate.getMonth() + 1).padStart(
          2,
          '0',
        );
        const followUpDay = String(followUpDate.getDate()).padStart(2, '0');
        const followUpHours = String(followUpDate.getHours()).padStart(2, '0');
        const followUpMinutes = String(followUpDate.getMinutes()).padStart(
          2,
          '0',
        );

        setValue(
          'followUpDate',
          `${followUpYear}-${followUpMonth}-${followUpDay}`,
        );
        setValue('followUpHour', `${followUpHours}:${followUpMinutes}`);
      } else {
        setValue('followUpDate', '');
        setValue('followUpHour', '');
      }

      setValue('veterinarian', editingVetVisit.veterinarian || '');
    }
  }, [editingVetVisit, setValue, reset]);

  const onSubmit = async (data: VetVisitFormState) => {
    // Combinar fecha y hora de visita en formato ISO
    // visitHour es requerido, así que siempre estará presente
    const visitDateISO = combineDateAndTimeToISO(
      data.visitDate,
      data.visitHour,
    );

    // Combinar fecha y hora de seguimiento si ambos existen
    const followUpDateISO =
      data.followUpDate && data.followUpHour
        ? combineDateAndTimeToISO(data.followUpDate, data.followUpHour)
        : null;

    const formData: VetVisitFormRequest = {
      visitDate: visitDateISO,
      reason: data.reason || null,
      diagnosis: data.diagnosis || null,
      treatment: data.treatment || null,
      followUpDate: followUpDateISO,
      veterinarian: data.veterinarian || null,
    };

    try {
      await onSave(formData);
      reset();
      onSuccess?.();
    } catch (err) {
      // Error ya manejado en el store o en el componente
      console.error('Error al guardar visita veterinaria:', err);
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
