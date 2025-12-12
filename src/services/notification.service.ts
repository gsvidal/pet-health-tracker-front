import { apiClient } from './api.config';

export interface NotificationResponse {
    id: string;
    reminder_id: string;
    pet_id: string;
    owner_id: string;
    sent_at: string;
    method: string;
    status: string;
    provider_response: string;
    created_at: string;
    updated_at: string;
}

// Obtener todas las notificaciones del usuario
export const getAllNotifications = async (skip = 0, limit = 100): Promise<NotificationResponse[]> => {
    const response = await apiClient.get(`/notifications/`, {
        params: { skip, limit },
    });
    return response.data;
};

// Obtener una notificación específica
export const getNotificationById = async (notificationId: string): Promise<NotificationResponse> => {
    const response = await apiClient.get(`/notifications/${notificationId}`);
    return response.data;
};

// Eliminar una notificación (solo admin)
export const deleteNotification = async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
};

// Procesar recordatorios vencidos (debe ser llamado por cron job)
export const processReminders = async (): Promise<string> => {
    const response = await apiClient.post('/reminders/process-due');
    return response.data;
};
