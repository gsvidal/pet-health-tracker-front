import { useReminderStore } from '../store/reminder.store';
import type { UpdateReminderRequest, ReminderFormRequest } from '../types/reminder.type';
import { useEffect } from 'react';

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
    fetchReminders,
    fetchReminderById,
    createReminder,
    updateReminder,
    deleteReminder,
    clearError,
    setSelectedReminder,
    getReminderById,
  } = useReminderStore();

  // Cargar recordatorios al montar
  useEffect(() => {
    if (autoFetch) {
      fetchReminders(petId, isActive);
    }
  }, [petId, isActive, autoFetch, fetchReminders]);

  // Helper para crear
  const handleCreate = async (data: ReminderFormRequest) => {
    try {
      await createReminder(data);
      // Refrescar lista después de crear
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

