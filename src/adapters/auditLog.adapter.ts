import type { AuditLog } from '../models/auditLog.model';
import type { AuditLogResponse } from '../types/auditLog.type';

/**
 * Adapta AuditLogResponse del backend (snake_case) a AuditLog del frontend (camelCase)
 */
export function adaptAuditLogResponseToAuditLog(
  response: AuditLogResponse,
): AuditLog {
  return {
    id: response.id,
    action: response.action,
    objectType: response.object_type,
    objectId: response.object_id,
    meta: response.meta,
    actorUserId: response.actor_user_id,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    actorUsername: response.actor_username,
    actorEmail: response.actor_email,
  };
}

/**
 * Adapta un array de AuditLogResponse a AuditLog
 */
export function adaptAuditLogsResponseToAuditLogs(
  responses: AuditLogResponse[],
): AuditLog[] {
  return responses.map(adaptAuditLogResponseToAuditLog);
}

