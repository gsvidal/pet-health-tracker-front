import { apiClient } from './api.config';
import type { Reminder, CreateReminderInput } from '../models/reminder.model';
import {
  adaptReminderResponseToReminder,
  type ReminderResponse,
} from '../adapters/reminder.adapter';

const BASE_URL = '/reminders';

export const ReminderService = {
  /** Obtener todos los recordatorios */
  async getAll(): Promise<Reminder[]> {
    const res = await apiClient.get<ReminderResponse[]>(BASE_URL);
    return res.data.map(adaptReminderResponseToReminder);
  },

  /** Obtener un recordatorio por ID */
  async getById(id: string): Promise<Reminder> {
    const res = await apiClient.get<ReminderResponse>(`${BASE_URL}/${id}`);
    return adaptReminderResponseToReminder(res.data);
  },

  /** Crear un recordatorio */
  async createReminder(reminder: CreateReminderInput): Promise<Reminder> {
    const payload = {
      title: reminder.title,
      description: reminder.description ?? null,
      event_time: reminder.eventTime,
      timezone: reminder.timezone ?? 'UTC',
      frequency: reminder.frequency,
      rrule: null,
      is_active: reminder.isActive,
      notify_by_email: reminder.notifyByEmail,
      notify_in_app: reminder.notifyInApp,
      pet_id: reminder.petId,
    };

    const res = await apiClient.post<ReminderResponse>(BASE_URL, payload);
    return adaptReminderResponseToReminder(res.data);
  },

  /** Actualizar un recordatorio */
  async updateReminder(
    id: string,
    reminder: Partial<Reminder>,
  ): Promise<Reminder> {
    const payload = {
      title: reminder.title,
      description: reminder.description ?? null,
      event_time: reminder.eventTime,
      timezone: reminder.timezone ?? 'UTC',
      frequency: reminder.frequency,
      rrule: reminder.rrule ?? null,
      is_active: reminder.isActive,
      notify_by_email: reminder.notifyByEmail,
      notify_in_app: reminder.notifyInApp,
      pet_id: reminder.petId ?? null,
    };

    const res = await apiClient.patch<ReminderResponse>(
      `${BASE_URL}/${id}`,
      payload,
    );
    return adaptReminderResponseToReminder(res.data);
  },

  /** Borrar un recordatorio */
  async deleteReminder(id: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
