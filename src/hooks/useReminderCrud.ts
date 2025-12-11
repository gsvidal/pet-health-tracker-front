import { useReminderStore } from '../store/reminder.store';
import type {
  UpdateReminderRequest,
  ReminderFormRequest,
} from '../types/reminder.type';
import { useEffect, useRef } from 'react';

interface UseReminderCrudProps {
  petId?: string | null;
  isActive?: boolean | null;
  autoFetch?: boolean; // Si debe cargar automáticamente al montar
}

export const useReminderCrud = ({
  petId,
  isActive,
  autoFetch = true,
}: UseReminderCrudProps) => {
  const {
    reminders,
    selectedReminder,
    loading,
    error,
    isCreating,
    fetchReminders,
    fetchReminderById,
    createReminder,
    updateReminder,
    deleteReminder,
    clearError,
    setSelectedReminder,
    getReminderById,
  } = useReminderStore();

  const hasFetchedRef = useRef(false);

  // Cargar recordatorios al montar (solo una vez)
  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchReminders(petId, isActive);
    }
  }, [petId, isActive, autoFetch, fetchReminders]);

  // Helper para crear
  const handleCreate = async (data: ReminderFormRequest) => {
    try {
      await createReminder(data);
      // Refrescar lista después de crear para obtener datos actualizados del servidor
      // Esto asegura que tenemos la versión más reciente y evita duplicados
      await fetchReminders(petId, isActive);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al crear recordatorio:', err);
    }
  };

  // Helper para actualizar
  const handleUpdate = async (id: string, data: UpdateReminderRequest) => {
    try {
      await updateReminder(id, data);
      // Refrescar lista después de actualizar
      await fetchReminders(petId, isActive);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al actualizar recordatorio:', err);
    }
  };

  // Helper para eliminar
  const handleDelete = async (id: string) => {
    try {
      await deleteReminder(id);
      // La lista se actualiza automáticamente en el store
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al eliminar recordatorio:', err);
    }
  };

  // Helper para toggle isActive
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await updateReminder(id, { isActive: !currentActive });
      await fetchReminders(petId, isActive);
    } catch (err) {
      console.error('Error al cambiar estado del recordatorio:', err);
    }
  };

  // Helper para seleccionar y cargar un recordatorio
  const handleSelectReminder = async (id: string) => {
    const existing = getReminderById(id);
    if (existing) {
      setSelectedReminder(existing);
    } else {
      await fetchReminderById(id);
    }
  };

  return {
    // Estado
    reminders,
    selectedReminder,
    loading,
    error,
    isCreating,

    // Acciones CRUD
    fetchReminders,
    fetchReminderById,
    createReminder: handleCreate,
    updateReminder: handleUpdate,
    deleteReminder: handleDelete,
    toggleActive: handleToggleActive,

    // Helpers
    clearError,
    setSelectedReminder,
    getReminderById,
    handleSelectReminder,
  };
};
