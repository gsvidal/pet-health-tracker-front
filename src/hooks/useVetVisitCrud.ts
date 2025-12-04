import { useVetVisitStore } from '../store/vetVisit.store';
import type {
  UpdateVetVisitRequest,
  VetVisitFormRequest,
} from '../types/vetVisit.type';
import { useEffect } from 'react';

interface UseVetVisitCrudProps {
  petId: string;
}

export const useVetVisitCrud = ({ petId }: UseVetVisitCrudProps) => {
  const {
    vetVisits,
    selectedVetVisit,
    loading,
    error,
    fetchVetVisitsByPetId,
    fetchVetVisitById,
    createVetVisit,
    updateVetVisit,
    deleteVetVisit,
    clearError,
    setSelectedVetVisit,
    getVetVisitById,
  } = useVetVisitStore();

  // Cargar visitas al montar
  useEffect(() => {
    if (petId) {
      fetchVetVisitsByPetId(petId);
    }
  }, [petId, fetchVetVisitsByPetId]);

  // Helper para crear
  const handleCreate = async (data: VetVisitFormRequest) => {
    try {
      await createVetVisit(petId, data);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al crear visita veterinaria:', err);
    }
  };

  // Helper para actualizar
  const handleUpdate = async (id: string, data: UpdateVetVisitRequest) => {
    try {
      await updateVetVisit(id, data);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al actualizar visita veterinaria:', err);
    }
  };

  // Helper para eliminar
  const handleDelete = async (id: string) => {
    try {
      await deleteVetVisit(id);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al eliminar visita veterinaria:', err);
    }
  };

  // Helper para seleccionar y cargar una visita
  const handleSelectVetVisit = async (id: string) => {
    const existing = getVetVisitById(id);
    if (existing) {
      setSelectedVetVisit(existing);
    } else {
      await fetchVetVisitById(id);
    }
  };

  return {
    // Estado
    vetVisits,
    selectedVetVisit,
    loading,
    error,

    // Acciones CRUD
    fetchVetVisitsByPetId,
    fetchVetVisitById,
    createVetVisit: handleCreate,
    updateVetVisit: handleUpdate,
    deleteVetVisit: handleDelete,

    // Helpers
    clearError,
    setSelectedVetVisit,
    getVetVisitById,
    handleSelectVetVisit,
  };
};

