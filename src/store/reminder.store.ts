import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Reminder } from '../models/reminder.model';
import type {
  ReminderFormRequest,
  UpdateReminderRequest,
} from '../types/reminder.type';
import { callApi } from '../utils/apiHelper';
import * as reminderService from '../services/reminder.service';
import { adaptReminderResponseToReminder } from '../adapters/reminder.adapter';

interface ReminderState {
  reminders: Reminder[];
  selectedReminder: Reminder | null;
  loading: boolean;
  error: string | null;

  // CREATE
  createReminder: (data: ReminderFormRequest) => Promise<void>;

  // READ
  fetchReminders: (petId?: string | null, isActive?: boolean | null) => Promise<void>;
  fetchReminderById: (id: string) => Promise<void>;

  // UPDATE
  updateReminder: (id: string, data: UpdateReminderRequest) => Promise<void>;

  // DELETE
  deleteReminder: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
  setSelectedReminder: (reminder: Reminder | null) => void;
  getReminderById: (id: string) => Reminder | undefined;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  selectedReminder: null,
  loading: false,
  error: null,

  // CREATE
  createReminder: async (data: ReminderFormRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      reminderService.createReminder(data),
    );

    if (error || !response) {
      const message = error || 'Error al crear el recordatorio';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const newReminder = adaptReminderResponseToReminder(response);

    // Agregar el nuevo recordatorio al estado
    set((state) => ({
      reminders: [...state.reminders, newReminder],
      loading: false,
      error: null,
    }));

    toast.success('Recordatorio creado correctamente ✔️');
  },

  // READ
  fetchReminders: async (petId?: string | null, isActive?: boolean | null) => {
    set({ loading: true, error: null });

    const { data: remindersResponse, error } = await callApi(() =>
      reminderService.getReminders(petId, isActive),
    );

    if (error || !remindersResponse) {
      const message = error || 'Error al obtener los recordatorios';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const reminders = remindersResponse.map(adaptReminderResponseToReminder);

    set({
      reminders,
      loading: false,
      error: null,
    });
  },

  // READ - By ID
  fetchReminderById: async (id: string) => {
    set({ loading: true, error: null });

    const { data: reminderResponse, error } = await callApi(() =>
      reminderService.getReminderById(id),
    );

    if (error || !reminderResponse) {
      const message = error || 'Error al obtener el recordatorio';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const reminder = adaptReminderResponseToReminder(reminderResponse);

    set({
      selectedReminder: reminder,
      loading: false,
      error: null,
    });
  },

  // UPDATE
  updateReminder: async (id: string, data: UpdateReminderRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      reminderService.updateReminder(id, data),
    );

    if (error || !response) {
      const message = error || 'Error al actualizar el recordatorio';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const updatedReminder = adaptReminderResponseToReminder(response);

    // Actualizar en la lista
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? updatedReminder : r,
      ),
      selectedReminder:
        state.selectedReminder?.id === id
          ? updatedReminder
          : state.selectedReminder,
      loading: false,
      error: null,
    }));

    toast.success('Recordatorio actualizado correctamente ✔️');
  },

  // DELETE
  deleteReminder: async (id: string) => {
    set({ loading: true, error: null });

    const { error } = await callApi(() => reminderService.deleteReminder(id));

    if (error) {
      const message = error || 'Error al eliminar el recordatorio';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    // Eliminar de la lista
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id),
      selectedReminder:
        state.selectedReminder?.id === id ? null : state.selectedReminder,
      loading: false,
      error: null,
    }));

    toast.success('Recordatorio eliminado correctamente ✔️');
  },

  // Utils
  clearError: () => set({ error: null }),

  setSelectedReminder: (reminder) => set({ selectedReminder: reminder }),

  getReminderById: (id: string) => {
    return get().reminders.find((r) => r.id === id);
  },
}));

