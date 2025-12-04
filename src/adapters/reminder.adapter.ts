import type { Reminder, ReminderFrequency } from '../models/reminder.model';
import type {
  ReminderFormRequest,
  UpdateReminderRequest,
} from '../types/reminder.type';

/**
 * Schema del backend (snake_case)
 * Según ReminderResponse de la API
 */
export interface ReminderResponse {
  id: string;
  owner_id: string;
  pet_id?: string | null;
  title: string;
  description?: string | null;
  event_time: string;
  timezone?: string | null;
  frequency: ReminderFrequency;
  rrule?: string | null;
  is_active: boolean;
  notify_by_email: boolean;
  notify_in_app: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Schema para crear recordatorio en el backend (snake_case)
 * Según ReminderCreate de la API
 * Requeridos: title, event_time
 */
export interface ReminderCreateRequest {
  title: string; // requerido, minLength: 1, maxLength: 200
  event_time: string; // requerido, format: date-time
  description?: string | null; // opcional
  timezone?: string | null; // opcional, default: "UTC"
  frequency?: ReminderFrequency; // opcional, default: "once"
  rrule?: string | null; // opcional
  is_active?: boolean; // opcional, default: true
  notify_by_email?: boolean; // opcional, default: true
  notify_in_app?: boolean; // opcional, default: true
  pet_id?: string | null; // opcional
}

/**
 * Schema para actualizar recordatorio en el backend (snake_case)
 * Según ReminderUpdate de la API (todos los campos opcionales)
 */
export interface ReminderUpdateRequest {
  title?: string | null; // opcional, minLength: 1, maxLength: 200
  description?: string | null; // opcional
  event_time?: string | null; // opcional, format: date-time
  timezone?: string | null; // opcional
  frequency?: ReminderFrequency | null; // opcional
  rrule?: string | null; // opcional
  is_active?: boolean | null; // opcional
  notify_by_email?: boolean | null; // opcional
  notify_in_app?: boolean | null; // opcional
  pet_id?: string | null; // opcional
}

/**
 * Adapta ReminderResponse del backend (snake_case) a Reminder del frontend (camelCase)
 */
export function adaptReminderResponseToReminder(
  reminderResponse: ReminderResponse,
): Reminder {
  return {
    id: reminderResponse.id,
    ownerId: reminderResponse.owner_id,
    petId: reminderResponse.pet_id,
    title: reminderResponse.title,
    description: reminderResponse.description,
    eventTime: reminderResponse.event_time,
    timezone: reminderResponse.timezone,
    frequency: reminderResponse.frequency,
    rrule: reminderResponse.rrule,
    isActive: reminderResponse.is_active,
    notifyByEmail: reminderResponse.notify_by_email,
    notifyInApp: reminderResponse.notify_in_app,
    createdAt: reminderResponse.created_at,
    updatedAt: reminderResponse.updated_at,
  };
}

/**
 * Adapta datos del frontend (camelCase) a ReminderCreateRequest del backend (snake_case)
 * Para crear un recordatorio
 */
export function adaptReminderToReminderCreateRequest(
  reminder: ReminderFormRequest,
): ReminderCreateRequest {
  return {
    title: reminder.title,
    event_time: reminder.eventTime,
    description: reminder.description ?? null,
    timezone: reminder.timezone ?? null,
    frequency: reminder.frequency ?? 'once',
    rrule: reminder.rrule ?? null,
    is_active: reminder.isActive ?? true,
    notify_by_email: reminder.notifyByEmail ?? true,
    notify_in_app: reminder.notifyInApp ?? true,
    pet_id: reminder.petId ?? null,
  };
}

/**
 * Adapta datos del frontend (camelCase) a ReminderUpdateRequest del backend (snake_case)
 * Para actualizar un recordatorio
 */
export function adaptReminderToReminderUpdateRequest(
  reminder: UpdateReminderRequest,
): ReminderUpdateRequest {
  const request: ReminderUpdateRequest = {};
  if (reminder.title !== undefined) request.title = reminder.title;
  if (reminder.description !== undefined)
    request.description = reminder.description;
  if (reminder.eventTime !== undefined) request.event_time = reminder.eventTime;
  if (reminder.timezone !== undefined) request.timezone = reminder.timezone;
  if (reminder.frequency !== undefined) request.frequency = reminder.frequency;
  if (reminder.rrule !== undefined) request.rrule = reminder.rrule;
  if (reminder.isActive !== undefined) request.is_active = reminder.isActive;
  if (reminder.notifyByEmail !== undefined)
    request.notify_by_email = reminder.notifyByEmail;
  if (reminder.notifyInApp !== undefined)
    request.notify_in_app = reminder.notifyInApp;
  if (reminder.petId !== undefined) request.pet_id = reminder.petId;
  return request;
}
