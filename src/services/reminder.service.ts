import { apiClient } from './api.config';
// Imports para versión HEAD (salud)
import type { ReminderResponse } from '../adapters/reminder.adapter';
import type {
  ReminderFormRequest,
  UpdateReminderRequest,
} from '../types/reminder.type';
import {
  adaptReminderToReminderCreateRequest,
  adaptReminderToReminderUpdateRequest,
} from '../adapters/reminder.adapter';

// Imports para versión pet-details (nutrición)
import type { Reminder, CreateReminderInput } from '../models/reminder.model';
import { adaptReminderResponseToReminder } from '../adapters/reminder.adapter';

const REMINDERS_ENDPOINT = '/reminders';
const BASE_URL = '/reminders';

// ============================================
// VERSIÓN HEAD (SALUD) - Funciones exportadas
// Usado por: reminder.store.ts, useReminderCrud, RemindersSection
// ============================================
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

// ============================================
// VERSIÓN PET-DETAILS (NUTRICIÓN) - Objeto ReminderService
// Usado por: useReminders, PetRegisterReminder, PetNutritionsSection
// ============================================
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
