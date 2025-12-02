import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Vaccine } from '../models/vaccine.model';
import type {
  VaccineFormRequest,
  UpdateVaccineRequest,
} from '../types/vaccine.type';
import { callApi } from '../utils/apiHelper';
import * as vaccineService from '../services/vaccine.service';
import { adaptVaccinationResponseToVaccine } from '../adapters/vaccine.adapter';

interface VaccineState {
  vaccines: Vaccine[];
  selectedVaccine: Vaccine | null;
  loading: boolean;
  error: string | null;

  // CREATE
  createVaccine: (petId: string, data: VaccineFormRequest) => Promise<void>;

  // READ
  fetchVaccinesByPetId: (petId: string) => Promise<void>;
  fetchVaccineById: (id: string) => Promise<void>;

  // UPDATE
  updateVaccine: (id: string, data: UpdateVaccineRequest) => Promise<void>;

  // DELETE
  deleteVaccine: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
  setSelectedVaccine: (vaccine: Vaccine | null) => void;
  getVaccineById: (id: string) => Vaccine | undefined;
}

export const useVaccineStore = create<VaccineState>((set, get) => ({
  vaccines: [],
  selectedVaccine: null,
  loading: false,
  error: null,

  // CREATE
  createVaccine: async (petId: string, data: VaccineFormRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      vaccineService.createVaccine(petId, data),
    );

    if (error || !response) {
      const message = error || 'Error al crear la vacuna';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const newVaccine = adaptVaccinationResponseToVaccine(response);

    // Agregar la nueva vacuna al estado
    set((state) => ({
      vaccines: [...state.vaccines, newVaccine],
      loading: false,
      error: null,
    }));

    toast.success('Vacuna registrada correctamente ✔️');
  },

  // READ - By Pet ID
  fetchVaccinesByPetId: async (petId: string) => {
    set({ loading: true, error: null });

    const { data: vaccinesResponse, error } = await callApi(() =>
      vaccineService.getVaccinesByPetId(petId),
    );

    if (error || !vaccinesResponse) {
      const message = error || 'Error al obtener las vacunas';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const vaccines = vaccinesResponse.map(adaptVaccinationResponseToVaccine);

    set({
      vaccines,
      loading: false,
      error: null,
    });
  },

  // READ - By ID
  fetchVaccineById: async (id: string) => {
    set({ loading: true, error: null });

    const { data: vaccineResponse, error } = await callApi(() =>
      vaccineService.getVaccineById(id),
    );

    if (error || !vaccineResponse) {
      const message = error || 'Error al obtener la vacuna';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    const vaccine = adaptVaccinationResponseToVaccine(vaccineResponse);

    set({
      selectedVaccine: vaccine,
      loading: false,
      error: null,
    });
  },

  // UPDATE
  updateVaccine: async (id: string, data: UpdateVaccineRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      vaccineService.updateVaccine(id, data),
    );

    if (error || !response) {
      const message = error || 'Error al actualizar la vacuna';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    const updatedVaccine = adaptVaccinationResponseToVaccine(response);

    // Actualizar en la lista
    set((state) => ({
      vaccines: state.vaccines.map((v) => (v.id === id ? updatedVaccine : v)),
      selectedVaccine:
        state.selectedVaccine?.id === id
          ? updatedVaccine
          : state.selectedVaccine,
      loading: false,
      error: null,
    }));

    toast.success('Vacuna actualizada correctamente ✔️');
  },

  // DELETE
  deleteVaccine: async (id: string) => {
    set({ loading: true, error: null });

    const { error } = await callApi(() => vaccineService.deleteVaccine(id));

    if (error) {
      const message = error || 'Error al eliminar la vacuna';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    // Eliminar de la lista
    set((state) => ({
      vaccines: state.vaccines.filter((v) => v.id !== id),
      selectedVaccine:
        state.selectedVaccine?.id === id ? null : state.selectedVaccine,
      loading: false,
      error: null,
    }));

    toast.success('Vacuna eliminada correctamente ✔️');
  },

  // Utils
  clearError: () => set({ error: null }),

  setSelectedVaccine: (vaccine) => set({ selectedVaccine: vaccine }),

  getVaccineById: (id: string) => {
    return get().vaccines.find((v) => v.id === id);
  },
}));

