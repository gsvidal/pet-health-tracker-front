import { apiClient } from './api.config';
import type { AuditLogResponse, AuditLogFilters } from '../types/auditLog.type';

const AUDIT_LOGS_ENDPOINT = '/audit-logs';

/**
 * Obtiene todos los logs de auditoría con filtros opcionales
 */
export const getAuditLogs = async (
  filters?: AuditLogFilters,
): Promise<AuditLogResponse[]> => {
  const response = await apiClient.get<AuditLogResponse[]>(
    AUDIT_LOGS_ENDPOINT,
    {
      params: {
        object_type: filters?.object_type || undefined,
        actor_user_id: filters?.actor_user_id || undefined,
        action: filters?.action || undefined,
        object_id: filters?.object_id || undefined,
        date_from: filters?.date_from || undefined,
        date_to: filters?.date_to || undefined,
        skip: filters?.skip || undefined,
        limit: filters?.limit || undefined,
      },
    },
  );
  return response.data;
};

/**
 * Obtiene la actividad del usuario autenticado
 */
export const getMyActivity = async (): Promise<AuditLogResponse[]> => {
  const response = await apiClient.get<AuditLogResponse[]>(
    `${AUDIT_LOGS_ENDPOINT}/my-activity`,
  );
  return response.data;
};

/**
 * Obtiene un log de auditoría por ID
 */
export const getAuditLogById = async (
  id: string,
): Promise<AuditLogResponse> => {
  const response = await apiClient.get<AuditLogResponse>(
    `${AUDIT_LOGS_ENDPOINT}/${id}`,
  );
  return response.data;
};
