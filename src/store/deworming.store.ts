import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import i18n from '../i18n/config';
import type { Deworming } from '../models/deworming.model';
import type {
  DewormingFormRequest,
  UpdateDewormingRequest,
} from '../types/deworming.type';
import { callApi } from '../utils/apiHelper';
import * as dewormingService from '../services/deworming.service';
import { adaptDewormingResponseToDeworming } from '../adapters/deworming.adapter';

interface DewormingState {
  dewormings: Deworming[];
  selectedDeworming: Deworming | null;
  loading: boolean;
  error: string | null;

  // CREATE
  createDeworming: (petId: string, data: DewormingFormRequest) => Promise<void>;

  // READ
  fetchDewormingsByPetId: (petId: string) => Promise<void>;
  fetchDewormingById: (id: string) => Promise<void>;

  // UPDATE
  updateDeworming: (
    id: string,
    data: UpdateDewormingRequest,
  ) => Promise<void>;

  // DELETE
  deleteDeworming: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
  setSelectedDeworming: (deworming: Deworming | null) => void;
  getDewormingById: (id: string) => Deworming | undefined;
}

export const useDewormingStore = create<DewormingState>((set, get) => ({
  dewormings: [],
  selectedDeworming: null,
  loading: false,
  error: null,

  // CREATE
  createDeworming: async (petId: string, data: DewormingFormRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      dewormingService.createDeworming(petId, data),
    );

    if (error || !response) {
      const message = error || 'Error al crear la desparasitación';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const newDeworming = adaptDewormingResponseToDeworming(response);

    // Agregar la nueva desparasitación al estado
    set((state) => ({
      dewormings: [...state.dewormings, newDeworming],
      loading: false,
      error: null,
    }));

    toast.success(i18n.t('toasts.deworming.created'));
  },

  // READ - By Pet ID
  fetchDewormingsByPetId: async (petId: string) => {
    set({ loading: true, error: null });

    const { data: dewormingsResponse, error } = await callApi(() =>
      dewormingService.getDewormingsByPetId(petId),
    );

    if (error || !dewormingsResponse) {
      const message = error || i18n.t('toasts.deworming.error.fetch');
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const dewormings = dewormingsResponse.map(adaptDewormingResponseToDeworming);

    set({
      dewormings,
      loading: false,
      error: null,
    });
  },

  // READ - By ID
  fetchDewormingById: async (id: string) => {
    set({ loading: true, error: null });

    const { data: dewormingResponse, error } = await callApi(() =>
      dewormingService.getDewormingById(id),
    );

    if (error || !dewormingResponse) {
      const message = error || i18n.t('toasts.deworming.error.fetch');
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const deworming = adaptDewormingResponseToDeworming(dewormingResponse);

    set({
      selectedDeworming: deworming,
      loading: false,
      error: null,
    });
  },

  // UPDATE
  updateDeworming: async (id: string, data: UpdateDewormingRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      dewormingService.updateDeworming(id, data),
    );

    if (error || !response) {
      const message = error || i18n.t('toasts.deworming.error.update');
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const updatedDeworming = adaptDewormingResponseToDeworming(response);

    // Actualizar en la lista
    set((state) => ({
      dewormings: state.dewormings.map((d) =>
        d.id === id ? updatedDeworming : d,
      ),
      selectedDeworming:
        state.selectedDeworming?.id === id
          ? updatedDeworming
          : state.selectedDeworming,
      loading: false,
      error: null,
    }));

    toast.success(i18n.t('toasts.deworming.updated'));
  },

  // DELETE
  deleteDeworming: async (id: string) => {
    set({ loading: true, error: null });

    const { error } = await callApi(() => dewormingService.deleteDeworming(id));

    if (error) {
      const message = error || i18n.t('toasts.deworming.error.delete');
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    // Eliminar de la lista
    set((state) => ({
      dewormings: state.dewormings.filter((d) => d.id !== id),
      selectedDeworming:
        state.selectedDeworming?.id === id ? null : state.selectedDeworming,
      loading: false,
      error: null,
    }));

    toast.success(i18n.t('toasts.deworming.deleted'));
  },

  // Utils
  clearError: () => set({ error: null }),

  setSelectedDeworming: (deworming) => set({ selectedDeworming: deworming }),

  getDewormingById: (id: string) => {
    return get().dewormings.find((d) => d.id === id);
  },
}));

