import { apiClient } from './api.config';
import type { ReminderFormRequest, UpdateReminderRequest, ReminderResponse } from '../types/reminder.type';

// Obtener todos los recordatorios del usuario
export const getReminders = async (
    petId?: string | null,
    isActive?: boolean | null
): Promise<ReminderResponse[]> => {
    const params: any = {};
    if (petId) params.pet_id = petId;
    if (isActive !== null && isActive !== undefined) params.is_active = isActive;

    const response = await apiClient.get('/reminders/', { params });
    return response.data;
};

// Obtener un recordatorio específico por ID
export const getReminderById = async (id: string): Promise<ReminderResponse> => {
    const response = await apiClient.get(`/reminders/${id}`);
    return response.data;
};

// Crear un nuevo recordatorio
export const createReminder = async (data: ReminderFormRequest): Promise<ReminderResponse> => {
    // Transformar de camelCase a snake_case para la API
    const apiData = {
        title: data.title,
        description: data.description || '',
        event_time: data.eventTime,
        timezone: data.timezone || 'UTC',
        frequency: data.frequency || 'once',
        rrule: data.rrule || '',
        is_active: data.isActive !== undefined ? data.isActive : true,
        notify_by_email: data.notifyByEmail !== undefined ? data.notifyByEmail : true,
        notify_in_app: data.notifyInApp !== undefined ? data.notifyInApp : true,
        pet_id: data.petId || null,
    };

    const response = await apiClient.post('/reminders/', apiData);
    return response.data;
};

// Actualizar un recordatorio existente
export const updateReminder = async (
    id: string,
    data: UpdateReminderRequest
): Promise<ReminderResponse> => {
    // Transformar de camelCase a snake_case para la API
    const apiData: any = {};
    if (data.title !== undefined) apiData.title = data.title;
    if (data.description !== undefined) apiData.description = data.description;
    if (data.eventTime !== undefined) apiData.event_time = data.eventTime;
    if (data.timezone !== undefined) apiData.timezone = data.timezone;
    if (data.frequency !== undefined) apiData.frequency = data.frequency;
    if (data.rrule !== undefined) apiData.rrule = data.rrule;
    if (data.isActive !== undefined) apiData.is_active = data.isActive;
    if (data.notifyByEmail !== undefined) apiData.notify_by_email = data.notifyByEmail;
    if (data.notifyInApp !== undefined) apiData.notify_in_app = data.notifyInApp;
    if (data.petId !== undefined) apiData.pet_id = data.petId;

    const response = await apiClient.put(`/reminders/${id}`, apiData);
    return response.data;
};

// Eliminar un recordatorio
export const deleteReminder = async (id: string): Promise<void> => {
    await apiClient.delete(`/reminders/${id}`);
};
