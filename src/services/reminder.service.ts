import { apiClient } from './api.config';
import type { ReminderResponse } from '../adapters/reminder.adapter';
import type {
  ReminderFormRequest,
  UpdateReminderRequest,
} from '../types/reminder.type';
import {
  adaptReminderToReminderCreateRequest,
  adaptReminderToReminderUpdateRequest,
} from '../adapters/reminder.adapter';

const REMINDERS_ENDPOINT = '/reminders';

/**
 * Obtiene todos los recordatorios del usuario
 */
export const getReminders = async (
  petId?: string | null,
  isActive?: boolean | null,
): Promise<ReminderResponse[]> => {
  const response = await apiClient.get<ReminderResponse[]>(REMINDERS_ENDPOINT, {
    params: {
      pet_id: petId || undefined,
      is_active: isActive !== undefined ? isActive : undefined,
    },
  });
  return response.data;
};

/**
 * Obtiene un recordatorio por ID
 */
export const getReminderById = async (
  id: string,
): Promise<ReminderResponse> => {
  const response = await apiClient.get<ReminderResponse>(
    `${REMINDERS_ENDPOINT}/${id}`,
  );
  return response.data;
};

/**
 * Crea un nuevo recordatorio
 */
export const createReminder = async (
  data: ReminderFormRequest,
): Promise<ReminderResponse> => {
  const requestData = adaptReminderToReminderCreateRequest(data);
  const response = await apiClient.post<ReminderResponse>(
    REMINDERS_ENDPOINT,
    requestData,
  );
  return response.data;
};

/**
 * Actualiza un recordatorio
 */
export const updateReminder = async (
  id: string,
  data: UpdateReminderRequest,
): Promise<ReminderResponse> => {
  const requestData = adaptReminderToReminderUpdateRequest(data);
  const response = await apiClient.put<ReminderResponse>(
    `${REMINDERS_ENDPOINT}/${id}`,
    requestData,
  );
  return response.data;
};

/**
 * Elimina un recordatorio
 */
export const deleteReminder = async (id: string): Promise<void> => {
  await apiClient.delete(`${REMINDERS_ENDPOINT}/${id}`);
};

