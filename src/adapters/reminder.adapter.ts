import type { Reminder, ReminderFrequency } from '../models/reminder.model';

/**
 * Schema del backend (snake_case)
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
