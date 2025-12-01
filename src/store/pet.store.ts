import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Pet } from '../models/pet.model';
import type { PetFormData } from '../adapters/pet.adapter';
import {
  getPets,
  getPetById,
  createPet as createPetService,
  updatePetService,
} from '../services/pet.service';
import { adaptPetResponseToPet } from '../adapters/pet.adapter';
import { callApi } from '../utils/apiHelper';

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  mockMode: boolean;

  // Acciones
  fetchPets: () => Promise<void>;
  fetchPetById: (id: string) => Promise<void>;
  createPet: (petData: PetFormData) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;
  clearError: () => void;
  mockPets: () => void;
  updatePet: (id: string, petData: PetFormData) => Promise<void>;
  setMockMode: (value: boolean) => void;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,
  mockMode: false,
  setMockMode: (value) => set({ mockMode: value }),

  fetchPets: async () => {
    set({ loading: true, error: null, mockMode: false });

    const { data: petsResponse, error } = await callApi(() => getPets());

    if (error || !petsResponse) {
      const message = error || 'Error al obtener mascotas';
      toast.error(message);
      set({ error: message, loading: false });
      return;
    }

    const pets = petsResponse.map(adaptPetResponseToPet);

    set({
      pets,
      loading: false,
      error: null,
    });
  },

  fetchPetById: async (id: string) => {
    set({ loading: true, error: null });

    const { data: petResponse, error } = await callApi(() => getPetById(id));

    if (error || !petResponse) {
      const message = error || 'Error al obtener la mascota';
      toast.error(message);
      set({ error: message, loading: false });
      return;
    }

    const pet = adaptPetResponseToPet(petResponse);

    set({
      selectedPet: pet,
      loading: false,
      error: null,
    });
  },

  createPet: async (petData: PetFormData) => {
    set({ loading: true, error: null });

    const { data: petResponse, error } = await callApi(() =>
      createPetService(petData),
    );

    if (error || !petResponse) {
      const message = error || 'Error al crear la mascota';
      toast.error(message);
      set({ error: message, loading: false });
      return;
    }

    const newPet = adaptPetResponseToPet(petResponse);

    // Agregar la nueva mascota al estado
    set((state) => ({
      pets: [...state.pets, newPet],
      loading: false,
      error: null,
    }));

    toast.success('Mascota creada correctamente ✔️');
  },

  getPetById: (id: string) => {
    return get().pets.find((pet) => pet.id === id);
  },

  clearError: () => set({ error: null }),
  mockPets: () => {
    const mockPet1: Pet = {
      id: 'mock-pet-1',
      name: 'Max',
      species: 'Perro',
      breed: 'Golden Retriever',
      birthDate: '2021-03-15T00:00:00Z',
      ageYears: 3,
      weightKg: '28',
      sex: 'Macho',
      photoUrl: null,
      notes: 'Mascota de prueba para UI',
      healthStatus: 'Saludable',
      ownerId: 'mock-owner',
      createdAt: '2021-03-15T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
    };

    const mockPet2: Pet = {
      id: 'mock-pet-2',
      name: 'Iggy',
      species: 'Iguana',
      breed: 'Iguana Verde',
      birthDate: '2022-06-10T00:00:00Z',
      ageYears: 2,
      weightKg: '1.5',
      sex: 'Hembra',
      photoUrl: null,
      notes: 'Iguana muy tranquila y amigable',
      healthStatus: 'Saludable',
      ownerId: 'mock-owner',
      createdAt: '2022-06-10T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    };

    set({
      pets: [mockPet1, mockPet2],
      loading: false,
      error: null,
      mockMode: true,
    });

    toast.success('Mascotas mock cargadas correctamente ✔️');
  },

  updatePet: async (id, petData) => {
    if (id.startsWith('mock-')) {
      console.warn('Mascota mock detectada. No se enviará update al backend.');

      // Simula actualización local
      const updatedPet = {
        ...get().selectedPet,
        ...petData,
        id: id,
      };
      set((state) => ({
        pets: state.pets.map((p) => (p.id === id ? updatedPet : p)),
        selectedPet: updatedPet,
      }));
      toast.success('Mascota mock actualizada localmente ✔️');
      return;
    }
    set({ loading: true, error: null });
    const { data: petResponse, error } = await callApi(() =>
      updatePetService(id, petData),
    );
    if (error || !petResponse) {
      const message = error || 'Error al actualizar la mascota';
      toast.error(message);
      set({ error: message, loading: false });
      return;
    }
    const updatedPet = adaptPetResponseToPet(petResponse);
    set((state) => ({
      pets: state.pets.map((p) => (p.id === id ? updatedPet : p)),
      selectedPet: updatedPet,
      loading: false,
      error: null,
    }));
    toast.success('Mascota actualizada correctamente ✔️');
  },
}));
