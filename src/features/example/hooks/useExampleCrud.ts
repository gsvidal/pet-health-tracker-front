import { useExampleStore } from '../../../store/example.store';
import type { UpdateContactFormRequest } from '../../../types/example.type';
import { useEffect } from 'react';

/**
 * Hook personalizado para operaciones CRUD
 * Solo se encarga de las operaciones de lectura, actualización y eliminación
 * NO maneja el formulario (eso es responsabilidad de useExampleForm)
 */
export const useExampleCrud = () => {
  const {
    submissions,
    selectedSubmission,
    loading,
    error,
    fetchSubmissions,
    fetchSubmissionById,
    updateSubmission,
    deleteSubmission,
    clearError,
    setSelectedSubmission,
    getSubmissionById,
  } = useExampleStore();

  // Opcional: Cargar submissions al montar el componente
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Helper para actualizar
  const handleUpdate = async (
    id: string,
    data: UpdateContactFormRequest,
  ) => {
    try {
      await updateSubmission(id, data);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al actualizar:', err);
    }
  };

  // Helper para eliminar
  const handleDelete = async (id: string) => {
    try {
      await deleteSubmission(id);
    } catch (err) {
      // Error ya manejado en el store
      console.error('Error al eliminar:', err);
    }
  };

  // Helper para seleccionar y cargar un submission
  const handleSelectSubmission = async (id: string) => {
    const existing = getSubmissionById(id);
    if (existing) {
      setSelectedSubmission(existing);
    } else {
      await fetchSubmissionById(id);
    }
  };

  return {
    // Estado
    submissions,
    selectedSubmission,
    loading,
    error,

    // Acciones CRUD
    fetchSubmissions,
    fetchSubmissionById,
    updateSubmission: handleUpdate,
    deleteSubmission: handleDelete,

    // Helpers
    clearError,
    setSelectedSubmission,
    getSubmissionById,
    handleSelectSubmission,
  };
};


