/**
 * Modelo de AuditLog para el frontend (camelCase)
 * Representa un log de auditoría en el formato interno de la aplicación
 */
export interface AuditLog {
  id: string;
  action: string;
  objectType: string | null;
  objectId: string | null;
  meta: Record<string, any> | null;
  actorUserId: string | null;
  createdAt: string;
  updatedAt: string;
  actorUsername?: string | null;
  actorEmail?: string | null;
}

