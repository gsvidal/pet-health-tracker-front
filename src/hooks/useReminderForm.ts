import { useForm } from 'react-hook-form';
import type {
  ReminderFormRequest,
  ReminderFormState,
} from '../types/reminder.type';
import { useEffect } from 'react';
import type { Reminder } from '../models/reminder.model';

interface UseReminderFormProps {
  editingReminder?: Reminder | null;
  onSave: (data: ReminderFormRequest) => Promise<void>;
  onSuccess?: () => void;
  defaultTitle?: string;
  defaultDescription?: string;
  suggestedEventTime?: string; // Para pre-llenar fecha/hora
}

export const useReminderForm = ({
  editingReminder,
  onSave,
  onSuccess,
  defaultTitle = '',
  defaultDescription = '',
  suggestedEventTime,
}: UseReminderFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
    watch,
  } = useForm<ReminderFormState>({
    mode: 'onChange',
    defaultValues: {
      title: defaultTitle,
      description: defaultDescription,
      eventTime: '',
      eventDate: '',
      eventHour: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      frequency: 'once',
      isActive: true,
      notifyByEmail: true,
      notifyInApp: true,
    },
  });

  // Cargar datos de recordatorio en modo edición o valores sugeridos
  useEffect(() => {
    if (editingReminder) {
      const eventDate = new Date(editingReminder.eventTime);
      setValue('title', editingReminder.title);
      setValue('description', editingReminder.description || '');
      setValue('eventDate', eventDate.toISOString().split('T')[0]);
      setValue('eventHour', eventDate.toTimeString().slice(0, 5));
      setValue('timezone', editingReminder.timezone || 'UTC');
      setValue('frequency', editingReminder.frequency);
      setValue('isActive', editingReminder.isActive);
      setValue('notifyByEmail', editingReminder.notifyByEmail);
      setValue('notifyInApp', editingReminder.notifyInApp);
    } else if (suggestedEventTime) {
      const suggestedDate = new Date(suggestedEventTime);
      setValue('eventDate', suggestedDate.toISOString().split('T')[0]);
      setValue('eventHour', suggestedDate.toTimeString().slice(0, 5));
    } else {
      reset();
    }
  }, [editingReminder, suggestedEventTime, setValue, reset]);

  const onSubmit = async (data: ReminderFormState) => {
    // Combinar fecha y hora en formato ISO
    // Crear fecha local y convertir a ISO (UTC)
    const localDateTime = new Date(`${data.eventDate}T${data.eventHour}:00`);
    const eventDateTime = localDateTime.toISOString();

    const formData: ReminderFormRequest = {
      title: data.title,
      description: data.description || null,
      eventTime: eventDateTime,
      timezone:
        data.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        'UTC',
      frequency: data.frequency,
      isActive: data.isActive,
      notifyByEmail: data.notifyByEmail,
      notifyInApp: data.notifyInApp,
    };

    try {
      await onSave(formData);
      reset();
      onSuccess?.();
    } catch (err) {
      // Error ya manejado en el store o en el componente
      console.error('Error al guardar recordatorio:', err);
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
    setValue,
  };
};
