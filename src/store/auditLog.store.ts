import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { AuditLogFilters } from '../types/auditLog.type';
import type { AuditLog } from '../models/auditLog.model';
import { callApi } from '../utils/apiHelper';
import * as auditLogService from '../services/auditLog.service';
import { adaptAuditLogsResponseToAuditLogs } from '../adapters/auditLog.adapter';

interface AuditLogState {
  auditLogs: AuditLog[]; // Logs filtrados (para mostrar)
  allAuditLogs: AuditLog[]; // Todos los logs sin filtrar (para contadores)
  loading: boolean;
  error: string | null;
  filters: AuditLogFilters;

  // READ
  fetchAuditLogs: (filters?: AuditLogFilters) => Promise<void>;
  fetchMyActivity: () => Promise<void>;
  fetchAuditLogById: (id: string) => Promise<void>;

  // Filters
  setFilters: (filters: Partial<AuditLogFilters>) => void;
  clearFilters: () => void;

  // Utils
  clearError: () => void;
}

export const useAuditLogStore = create<AuditLogState>((set, get) => ({
  auditLogs: [],
  allAuditLogs: [], // Todos los logs sin filtrar
  loading: false,
  error: null,
  filters: {},

  // READ
  fetchAuditLogs: async (filters?: AuditLogFilters) => {
    set({ loading: true, error: null });

    const currentFilters = filters || get().filters;
    const hasFilters = Boolean(
      currentFilters.object_type ||
        currentFilters.actor_user_id ||
        currentFilters.action ||
        currentFilters.object_id ||
        currentFilters.date_from ||
        currentFilters.date_to,
    );

    // Usar límite de 250 para todos los casos (balance entre rendimiento y precisión)
    const filtersToUse = {
      ...currentFilters,
      limit: currentFilters.limit || 250,
    };

    const { data: auditLogsResponse, error } = await callApi(() =>
      auditLogService.getAuditLogs(filtersToUse),
    );

    if (error || !auditLogsResponse) {
      const message = error || 'Error al obtener los logs de auditoría';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const auditLogs = adaptAuditLogsResponseToAuditLogs(auditLogsResponse);

    // Si no hay filtros, guardar también en allAuditLogs
    // Si hay filtros, mantener allAuditLogs y solo actualizar auditLogs
    if (!hasFilters) {
      set({
        auditLogs,
        allAuditLogs: auditLogs, // Guardar todos los logs sin filtrar (hasta 250)
        loading: false,
        error: null,
      });
    } else {
      set({
        auditLogs, // Solo los filtrados
        loading: false,
        error: null,
        // allAuditLogs se mantiene sin cambios
      });
    }
  },

  fetchMyActivity: async () => {
    set({ loading: true, error: null });

    const { data: auditLogsResponse, error } = await callApi(() =>
      auditLogService.getMyActivity(),
    );

    if (error || !auditLogsResponse) {
      const message = error || 'Error al obtener tu actividad';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const auditLogs = adaptAuditLogsResponseToAuditLogs(auditLogsResponse);

    set({
      auditLogs,
      loading: false,
      error: null,
    });
  },

  fetchAuditLogById: async (id: string) => {
    set({ loading: true, error: null });

    const { data: auditLogResponse, error } = await callApi(() =>
      auditLogService.getAuditLogById(id),
    );

    if (error || !auditLogResponse) {
      const message = error || 'Error al obtener el log de auditoría';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const auditLog = adaptAuditLogsResponseToAuditLogs([auditLogResponse])[0];

    // Actualizar o agregar el log en la lista
    set((state) => {
      const existingIndex = state.auditLogs.findIndex((log) => log.id === id);
      const updatedLogs =
        existingIndex >= 0
          ? state.auditLogs.map((log, index) =>
              index === existingIndex ? auditLog : log,
            )
          : [...state.auditLogs, auditLog];

      return {
        auditLogs: updatedLogs,
        loading: false,
        error: null,
      };
    });
  },

  // Filters
  setFilters: (newFilters: Partial<AuditLogFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  // Utils
  clearError: () => {
    set({ error: null });
  },
}));
