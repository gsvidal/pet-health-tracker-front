import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { VetVisit } from '../models/vetVisit.model';
import type {
  VetVisitFormRequest,
  UpdateVetVisitRequest,
} from '../types/vetVisit.type';
import { callApi } from '../utils/apiHelper';
import * as vetVisitService from '../services/vetVisit.service';
import { adaptVetVisitResponseToVetVisit } from '../adapters/vetVisit.adapter';

interface VetVisitState {
  vetVisits: VetVisit[];
  selectedVetVisit: VetVisit | null;
  loading: boolean;
  error: string | null;

  // CREATE
  createVetVisit: (petId: string, data: VetVisitFormRequest) => Promise<void>;

  // READ
  fetchVetVisitsByPetId: (petId: string) => Promise<void>;
  fetchVetVisitById: (id: string) => Promise<void>;

  // UPDATE
  updateVetVisit: (id: string, data: UpdateVetVisitRequest) => Promise<void>;

  // DELETE
  deleteVetVisit: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
  setSelectedVetVisit: (vetVisit: VetVisit | null) => void;
  getVetVisitById: (id: string) => VetVisit | undefined;
}

export const useVetVisitStore = create<VetVisitState>((set, get) => ({
  vetVisits: [],
  selectedVetVisit: null,
  loading: false,
  error: null,

  // CREATE
  createVetVisit: async (petId: string, data: VetVisitFormRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      vetVisitService.createVetVisit(petId, data),
    );

    if (error || !response) {
      const message = error || 'Error al crear la visita veterinaria';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const newVetVisit = adaptVetVisitResponseToVetVisit(response);

    // Agregar la nueva visita al estado
    set((state) => ({
      vetVisits: [...state.vetVisits, newVetVisit],
      loading: false,
      error: null,
    }));

    toast.success('Visita veterinaria registrada correctamente ✔️');
  },

  // READ - By Pet ID
  fetchVetVisitsByPetId: async (petId: string) => {
    set({ loading: true, error: null });

    const { data: vetVisitsResponse, error } = await callApi(() =>
      vetVisitService.getVetVisitsByPetId(petId),
    );

    if (error || !vetVisitsResponse) {
      const message = error || 'Error al obtener las visitas veterinarias';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const vetVisits = vetVisitsResponse.map(adaptVetVisitResponseToVetVisit);

    set({
      vetVisits,
      loading: false,
      error: null,
    });
  },

  // READ - By ID
  fetchVetVisitById: async (id: string) => {
    set({ loading: true, error: null });

    const { data: vetVisitResponse, error } = await callApi(() =>
      vetVisitService.getVetVisitById(id),
    );

    if (error || !vetVisitResponse) {
      const message = error || 'Error al obtener la visita veterinaria';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const vetVisit = adaptVetVisitResponseToVetVisit(vetVisitResponse);

    set({
      selectedVetVisit: vetVisit,
      loading: false,
      error: null,
    });
  },

  // UPDATE
  updateVetVisit: async (id: string, data: UpdateVetVisitRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      vetVisitService.updateVetVisit(id, data),
    );

    if (error || !response) {
      const message = error || 'Error al actualizar la visita veterinaria';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const updatedVetVisit = adaptVetVisitResponseToVetVisit(response);

    // Actualizar en la lista
    set((state) => ({
      vetVisits: state.vetVisits.map((v) =>
        v.id === id ? updatedVetVisit : v,
      ),
      selectedVetVisit:
        state.selectedVetVisit?.id === id
          ? updatedVetVisit
          : state.selectedVetVisit,
      loading: false,
      error: null,
    }));

    toast.success('Visita veterinaria actualizada correctamente ✔️');
  },

  // DELETE
  deleteVetVisit: async (id: string) => {
    set({ loading: true, error: null });

    const { error } = await callApi(() => vetVisitService.deleteVetVisit(id));

    if (error) {
      const message = error || 'Error al eliminar la visita veterinaria';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    // Eliminar de la lista
    set((state) => ({
      vetVisits: state.vetVisits.filter((v) => v.id !== id),
      selectedVetVisit:
        state.selectedVetVisit?.id === id ? null : state.selectedVetVisit,
      loading: false,
      error: null,
    }));

    toast.success('Visita veterinaria eliminada correctamente ✔️');
  },

  // Utils
  clearError: () => set({ error: null }),

  setSelectedVetVisit: (vetVisit) => set({ selectedVetVisit: vetVisit }),

  getVetVisitById: (id: string) => {
    return get().vetVisits.find((v) => v.id === id);
  },
}));
