import { create } from 'zustand';
import {
  getAllNotifications,
  type NotificationResponse,
  processReminders,
} from '../services/notification.service';
import { getPetById } from '../services/pet.service';
import { getReminderById } from '../services/reminder.service';
import { callApi } from '../utils/apiHelper';

export interface Notification {
  id: string;
  title: string;
  description: string;
  petName: string;
  time: string;
  iconType: 'vaccine' | 'food' | 'medicine' | 'vet';
  isRead: boolean;
  rawData?: NotificationResponse;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  getUnreadCount: () => number;
  processDueReminders: () => Promise<void>;
}

// Función auxiliar para convertir NotificationResponse a Notification
const mapNotificationResponse = (
  apiNotification: NotificationResponse,
): Notification => {
  // Calcular tiempo relativo
  const sentDate = new Date(apiNotification.sent_at);
  const now = new Date();
  const diffMs = now.getTime() - sentDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeString = 'Ahora';
  if (diffMins < 60) {
    timeString = `Hace ${diffMins}m`;
  } else if (diffHours < 24) {
    timeString = `Hace ${diffHours}h`;
  } else {
    timeString = `Hace ${diffDays}d`;
  }

  // Determinar iconType basado en el método o status
  let iconType: 'vaccine' | 'food' | 'medicine' | 'vet' = 'vet';
  const method = apiNotification.method?.toLowerCase() || '';

  if (method.includes('vaccine') || method.includes('vacuna')) {
    iconType = 'vaccine';
  } else if (
    method.includes('food') ||
    method.includes('alimentación') ||
    method.includes('comida')
  ) {
    iconType = 'food';
  } else if (
    method.includes('medicine') ||
    method.includes('medicamento') ||
    method.includes('desparasit')
  ) {
    iconType = 'medicine';
  } else {
    iconType = 'vet';
  }

  return {
    id: apiNotification.id,
    title: apiNotification.method || 'Recordatorio',
    description:
      typeof apiNotification.provider_response === 'object' &&
      apiNotification.provider_response !== null
        ? JSON.stringify(apiNotification.provider_response)
        : apiNotification.provider_response || 'Notificación recibida',
    petName: 'Mascota', // TODO: Obtener nombre real de la mascota usando pet_id
    time: timeString,
    iconType,
    isRead: apiNotification.status === 'read',
    rawData: apiNotification,
  };
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });

    const { data, error } = await callApi(() => getAllNotifications(0, 100));

    if (error || !data) {
      set({
        loading: false,
        error: error || 'Error al cargar notificaciones',
        notifications: [],
      });
      return;
    }

    // Build a map of pet_id to pet name AND reminder_id to reminder data
    const uniquePetIds = Array.from(new Set(data.map((n) => n.pet_id)));
    const uniqueReminderIds = Array.from(
      new Set(data.map((n) => n.reminder_id)),
    );

    const petIdNameMap: Record<string, string> = {};
    const reminderMap: Record<string, { title: string; description: string }> =
      {};

    // Fetch pets
    for (const petId of uniquePetIds) {
      const { data: petData, error: petError } = await callApi(() =>
        getPetById(petId),
      );
      if (!petError && petData && petData.name) {
        petIdNameMap[petId] = petData.name;
      } else {
        petIdNameMap[petId] = 'Mascota';
      }
    }

    // Fetch reminders
    for (const reminderId of uniqueReminderIds) {
      const { data: reminderData, error: reminderError } = await callApi(() =>
        getReminderById(reminderId),
      );
      if (!reminderError && reminderData) {
        reminderMap[reminderId] = {
          title: reminderData.title,
          description: reminderData.description || '',
        };
      }
    }

    const mappedNotifications = data.map((n) => {
      const base = mapNotificationResponse(n);
      const reminderInfo = reminderMap[n.reminder_id];

      // Determine icon type from reminder info
      let iconType: 'vaccine' | 'food' | 'medicine' | 'vet' = base.iconType;

      if (reminderInfo) {
        const text =
          `${reminderInfo.title} ${reminderInfo.description}`.toLowerCase();
        if (
          text.includes('vaccine') ||
          text.includes('vacuna') ||
          text.includes('inmuniza')
        ) {
          iconType = 'vaccine';
        } else if (
          text.includes('nutrición') ||
          text.includes('nutrition') ||
          text.includes('aliment') ||
          text.includes('comida') ||
          text.includes('dieta')
        ) {
          iconType = 'food';
        } else if (
          text.includes('medicamento') ||
          text.includes('medicine') ||
          text.includes('pastilla') ||
          text.includes('desparasit') ||
          text.includes('deworm')
        ) {
          iconType = 'medicine';
        } else {
          iconType = 'vet';
        }
      }

      return {
        ...base,
        petName: petIdNameMap[n.pet_id] || 'Mascota',
        title: reminderInfo
          ? reminderInfo.title
          : n.method === 'email'
            ? 'Notificación por Email'
            : 'Recordatorio',
        description: reminderInfo
          ? `Recordatorio: ${reminderInfo.description}`
          : n.provider_response && typeof n.provider_response === 'string'
            ? n.provider_response
            : 'Tienes un recordatorio pendiente',
        iconType,
        rawData: n, // Guardar datos originales para filtrar duplicados
      };
    });

    // Filtrar duplicados: agrupar por reminder_id + pet_id y tomar solo la más reciente
    const notificationMap = new Map<string, Notification>();

    for (const notification of mappedNotifications) {
      if (!notification.rawData) continue;

      // Crear clave única basada en reminder_id y pet_id
      const key = `${notification.rawData.reminder_id}_${notification.rawData.pet_id}`;
      const existing = notificationMap.get(key);

      if (!existing) {
        notificationMap.set(key, notification);
      } else {
        // Comparar fechas: tomar la más reciente
        const existingDate = new Date(
          existing.rawData?.sent_at || existing.rawData?.created_at || 0,
        );
        const currentDate = new Date(
          notification.rawData.sent_at || notification.rawData.created_at || 0,
        );

        if (currentDate > existingDate) {
          notificationMap.set(key, notification);
        }
      }
    }

    // Convertir Map a Array (mantener rawData para ordenamiento)
    const notificationsWithRawData = Array.from(notificationMap.values());

    // Ordenar por fecha más reciente primero
    notificationsWithRawData.sort((a, b) => {
      const rawA = a.rawData as NotificationResponse | undefined;
      const rawB = b.rawData as NotificationResponse | undefined;
      const dateA = rawA
        ? new Date(rawA.sent_at || rawA.created_at || 0).getTime()
        : 0;
      const dateB = rawB
        ? new Date(rawB.sent_at || rawB.created_at || 0).getTime()
        : 0;
      return dateB - dateA;
    });

    // Limpiar rawData del resultado final (ya no es necesario después del filtrado)
    const uniqueNotifications: Notification[] = notificationsWithRawData.map(
      (n) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rawData, ...rest } = n;
        return rest as Notification;
      },
    );

    set({
      notifications: uniqueNotifications,
      loading: false,
      error: null,
    });
  },

  getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,

  processDueReminders: async () => {
    set({ loading: true, error: null });
    const { error } = await callApi(() => processReminders());

    if (error) {
      set({ loading: false, error });
      return;
    }

    // Refresh notifications after processing
    await get().fetchNotifications();
  },
}));
