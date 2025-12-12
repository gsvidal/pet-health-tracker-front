import { useVaccineStore } from '../store/vaccine.store';
import type {
  UpdateVaccineRequest,
  VaccineFormRequest,
} from '../types/vaccine.type';
import { useEffect } from 'react';

interface UseVaccineCrudProps {
  petId: string;
}

export const useVaccineCrud = ({ petId }: UseVaccineCrudProps) => {
  const {
    vaccines,
    selectedVaccine,
    loading,
    error,
    fetchVaccinesByPetId,
    fetchVaccineById,
    createVaccine,
    updateVaccine,
    deleteVaccine,
    clearError,
    setSelectedVaccine,
    getVaccineById,
  } = useVaccineStore();

  // Cargar vacunas al montar
  useEffect(() => {
    if (petId) {
      fetchVaccinesByPetId(petId);
    }
  }, [petId, fetchVaccinesByPetId]);

  // Helper para crear
  const handleCreate = async (data: VaccineFormRequest) => {
    try {
      await createVaccine(petId, data);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al crear vacuna:', err);
    }
  };

  // Helper para actualizar
  const handleUpdate = async (id: string, data: UpdateVaccineRequest) => {
    try {
      await updateVaccine(id, data);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al actualizar vacuna:', err);
    }
  };

  // Helper para eliminar
  const handleDelete = async (id: string) => {
    try {
      await deleteVaccine(id);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al eliminar vacuna:', err);
    }
  };

  // Helper para seleccionar y cargar una vacuna
  const handleSelectVaccine = async (id: string) => {
    const existing = getVaccineById(id);
    if (existing) {
      setSelectedVaccine(existing);
    } else {
      await fetchVaccineById(id);
    }
  };

  return {
    // Estado
    vaccines,
    selectedVaccine,
    loading,
    error,

    // Acciones CRUD
    fetchVaccinesByPetId,
    fetchVaccineById,
    createVaccine: handleCreate,
    updateVaccine: handleUpdate,
    deleteVaccine: handleDelete,

    // Helpers
    clearError,
    setSelectedVaccine,
    getVaccineById,
    handleSelectVaccine,
  };
};
