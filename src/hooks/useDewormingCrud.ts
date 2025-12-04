import { useDewormingStore } from '../store/deworming.store';
import type {
  UpdateDewormingRequest,
  DewormingFormRequest,
} from '../types/deworming.type';
import { useEffect } from 'react';

interface UseDewormingCrudProps {
  petId: string;
}

export const useDewormingCrud = ({ petId }: UseDewormingCrudProps) => {
  const {
    dewormings,
    selectedDeworming,
    loading,
    error,
    fetchDewormingsByPetId,
    fetchDewormingById,
    createDeworming,
    updateDeworming,
    deleteDeworming,
    clearError,
    setSelectedDeworming,
    getDewormingById,
  } = useDewormingStore();

  // Cargar desparasitaciones al montar
  useEffect(() => {
    if (petId) {
      fetchDewormingsByPetId(petId);
    }
  }, [petId, fetchDewormingsByPetId]);

  // Helper para crear
  const handleCreate = async (data: DewormingFormRequest) => {
    try {
      await createDeworming(petId, data);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al crear desparasitación:', err);
    }
  };

  // Helper para actualizar
  const handleUpdate = async (id: string, data: UpdateDewormingRequest) => {
    try {
      await updateDeworming(id, data);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al actualizar desparasitación:', err);
    }
  };

  // Helper para eliminar
  const handleDelete = async (id: string) => {
    try {
      await deleteDeworming(id);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al eliminar desparasitación:', err);
    }
  };

  // Helper para seleccionar y cargar una desparasitación
  const handleSelectDeworming = async (id: string) => {
    const existing = getDewormingById(id);
    if (existing) {
      setSelectedDeworming(existing);
    } else {
      await fetchDewormingById(id);
    }
  };

  return {
    // Estado
    dewormings,
    selectedDeworming,
    loading,
    error,

    // Acciones CRUD
    fetchDewormingsByPetId,
    fetchDewormingById,
    createDeworming: handleCreate,
    updateDeworming: handleUpdate,
    deleteDeworming: handleDelete,

    // Helpers
    clearError,
    setSelectedDeworming,
    getDewormingById,
    handleSelectDeworming,
  };
};

