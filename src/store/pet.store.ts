import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Pet } from '../models/pet.model';
import { getPets, getPetById } from '../services/pet.service';
import { adaptPetResponseToPet } from '../adapters/pet.adapter';
// import { callApi } from '../utils/apiHelper'; // TODO: Restaurar cuando apiHelper original esté listo

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;

  // Acciones
  fetchPets: () => Promise<void>;
  fetchPetById: (id: string) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;
  clearError: () => void;
  mockPets: () => void;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,

  fetchPets: async () => {
    set({ loading: true, error: null });

    // TODO: Restaurar cuando apiHelper original esté listo
    // const { data: petsResponse, error } = await callApi(() => getPets());

    try {
      const petsResponse = await getPets();
      const pets = petsResponse.map(adaptPetResponseToPet);

      set({
        pets,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Error al obtener mascotas';
      toast.error(message);
      set({
        error: message,
        loading: false,
      });
    }
  },

  fetchPetById: async (id: string) => {
    set({ loading: true, error: null });

    // TODO: Restaurar cuando apiHelper original esté listo
    // const { data: petResponse, error } = await callApi(() => getPetById(id));

    try {
      const petResponse = await getPetById(id);
      const pet = adaptPetResponseToPet(petResponse);

      set({
        selectedPet: pet,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Error al obtener la mascota';
      toast.error(message);
      set({
        error: message,
        loading: false,
      });
    }
  },

  getPetById: (id: string) => {
    return get().pets.find((pet) => pet.id === id);
  },

  clearError: () => {
    set({ error: null });
  },

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
      ownerId: 'mock-owner',
      createdAt: '2022-06-10T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    };

    set({
      pets: [mockPet1, mockPet2],
      loading: false,
      error: null,
    });

    toast.success('Mascotas mock cargadas correctamente ✔️');
  },
}));
