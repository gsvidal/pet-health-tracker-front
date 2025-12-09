import { useEffect } from 'react';
import { useAuditLogStore } from '../store/auditLog.store';
import type { AuditLogFilters, SortOrder } from '../types/auditLog.type';
import type { AuditLog } from '../models/auditLog.model';

interface UseAuditLogsProps {
  autoFetch?: boolean;
  initialFilters?: AuditLogFilters;
}

export const useAuditLogs = ({
  autoFetch = true,
  initialFilters,
}: UseAuditLogsProps = {}) => {
  const {
    auditLogs,
    allAuditLogs,
    loading,
    error,
    filters,
    fetchAuditLogs,
    setFilters,
    clearFilters,
    clearError,
  } = useAuditLogStore();

  // Cargar logs al montar
  useEffect(() => {
    if (autoFetch) {
      // Siempre cargar todos los logs sin filtros primero (si allAuditLogs está vacío)
      // para poblar los contadores, luego aplicar filtros si los hay
      if (allAuditLogs.length === 0) {
        fetchAuditLogs({}); // Esto poblará allAuditLogs con límite 1000
      }

      // Luego aplicar filtros iniciales si los hay
      if (initialFilters) {
        setFilters(initialFilters);
        fetchAuditLogs(initialFilters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  // Función para aplicar filtros
  const applyFilters = async (newFilters: Partial<AuditLogFilters>) => {
    // Si newFilters está vacío o solo tiene valores null/undefined, limpiar todos los filtros
    const isEmpty =
      Object.keys(newFilters).length === 0 ||
      Object.values(newFilters).every((v) => v === null || v === undefined);

    if (isEmpty) {
      clearFilters();
      // Llamar sin filtros para obtener todos los logs
      await fetchAuditLogs({});
    } else {
      setFilters(newFilters);
      // Mergear con filtros existentes, pero sobrescribir con los nuevos
      await fetchAuditLogs({ ...filters, ...newFilters });
    }
  };

  // Función para ordenar logs
  const getSortedLogs = (order: SortOrder = 'desc'): AuditLog[] => {
    const sorted = [...auditLogs];
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  };

  return {
    // Estado
    auditLogs,
    allAuditLogs, // Todos los logs sin filtrar (para contadores)
    loading,
    error,
    filters,

    // Acciones
    fetchAuditLogs,
    applyFilters,
    clearFilters,
    getSortedLogs,
    clearError,
  };
};
