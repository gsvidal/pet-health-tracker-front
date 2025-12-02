import type { Reminder } from '../models/reminder.model';
import {
  adaptReminderResponseToReminder,
  type ReminderResponse,
} from '../adapters/reminder.adapter';

const BASE_URL = 'https://pet-healthcare-back.onrender.com/reminders';

export const ReminderService = {
  /** Obtener todos los recordatorios */
  async getAll(): Promise<Reminder[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error obteniendo recordatorios');

    const data: ReminderResponse[] = await res.json();
    return data.map(adaptReminderResponseToReminder);
  },

  /** Obtener un recordatorio por ID */
  async getById(id: string): Promise<Reminder> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Error obteniendo recordatorio por ID');

    const data: ReminderResponse = await res.json();
    return adaptReminderResponseToReminder(data);
  },

  /** Crear un recordatorio */
  async createReminder(reminder: Partial<Reminder>): Promise<Reminder> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminder),
    });

    if (!res.ok) throw new Error('Error creando recordatorio');

    const data: ReminderResponse = await res.json();
    return adaptReminderResponseToReminder(data);
  },

  /** Actualizar un recordatorio */
  async updateReminder(
    id: string,
    reminder: Partial<Reminder>,
  ): Promise<Reminder> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminder),
    });

    if (!res.ok) throw new Error('Error actualizando recordatorio');

    const data: ReminderResponse = await res.json();
    return adaptReminderResponseToReminder(data);
  },

  /** Borrar un recordatorio */
  async deleteReminder(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Error eliminando recordatorio');
  },
};
