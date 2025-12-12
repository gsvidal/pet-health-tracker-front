export type AuditLogObjectType =
  | 'User'
  | 'Reminder'
  | 'Pet'
  | 'Meal'
  | 'VetVisit'
  | 'Deworming'
  | 'Vaccination';

export type SortOrder = 'asc' | 'desc';

export interface AuditLogFilters {
  object_type?: AuditLogObjectType | null;
  actor_user_id?: string | null;
  action?: string | null;
  object_id?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  skip?: number;
  limit?: number;
}

export interface AuditLogResponse {
  id: string;
  action: string;
  object_type: string | null;
  object_id: string | null;
  meta: Record<string, any> | null;
  actor_user_id: string | null;
  created_at: string;
  updated_at: string;
  actor_username?: string | null;
  actor_email?: string | null;
}

// Mapeo de object_type a español
export const OBJECT_TYPE_LABELS: Record<AuditLogObjectType, string> = {
  User: 'Usuario',
  Reminder: 'Recordatorio',
  Pet: 'Mascota',
  Meal: 'Comida',
  VetVisit: 'Visita Veterinaria',
  Deworming: 'Desparasitación',
  Vaccination: 'Vacunación',
};

// Array estático de object types
export const OBJECT_TYPES: AuditLogObjectType[] = [
  'User',
  'Reminder',
  'Pet',
  'Meal',
  'VetVisit',
  'Deworming',
  'Vaccination',
];
