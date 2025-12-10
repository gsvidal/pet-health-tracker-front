import type { ReminderFrequency } from '../models/reminder.model';

// ---------- Formulario de Recordatorio ----------
// Según ReminderCreate de la API: requeridos: title, event_time
export interface ReminderFormRequest {
  title: string; // requerido, minLength: 1, maxLength: 200
  description?: string | null; // opcional
  eventTime: string; // requerido, format: date-time
  timezone?: string | null; // opcional, default: "UTC"
  frequency?: ReminderFrequency; // opcional, default: "once"
  rrule?: string | null; // opcional
  isActive?: boolean; // opcional, default: true
  notifyByEmail?: boolean; // opcional, default: true
  notifyInApp?: boolean; // opcional, default: true
  petId?: string | null; // opcional
}

/**
 * Estado del formulario (valores como strings para inputs de React)
 * Se convierte a ReminderFormRequest antes de enviar
 */
export interface ReminderFormState {
  title: string;
  description: string;
  eventTime: string; // date-time string
  eventDate: string; // date para input type="date"
  eventHour: string; // time para input type="time"
  timezone: string;
  frequency: ReminderFrequency;
  isActive: boolean;
  notifyByEmail: boolean;
  notifyInApp: boolean;
}

/**
 * Para actualizar (todos los campos opcionales según ReminderUpdate)
 */
export interface UpdateReminderRequest {
  title?: string | null; // opcional, minLength: 1, maxLength: 200
  description?: string | null; // opcional
  eventTime?: string | null; // opcional, format: date-time
  timezone?: string | null; // opcional
  frequency?: ReminderFrequency | null; // opcional
  rrule?: string | null; // opcional
  isActive?: boolean | null; // opcional
  notifyByEmail?: boolean | null; // opcional
  notifyInApp?: boolean | null; // opcional
  petId?: string | null; // opcional
}

// ---------- Respuesta de la API ----------
export interface ReminderResponse {
  id: string;
  owner_id: string;
  pet_id: string;
  title: string;
  description: string;
  event_time: string;
  timezone: string;
  frequency: ReminderFrequency;
  rrule: string;
  is_active: boolean;
  notify_by_email: boolean;
  notify_in_app: boolean;
  created_at: string;
  updated_at: string;
}

