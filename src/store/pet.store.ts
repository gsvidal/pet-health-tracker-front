import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Pet } from '../models/pet.model';
import type { PetFormData } from '../adapters/pet.adapter';
import {
  getPets,
  getPetById,
  createPet as createPetService,
  deletePet as deletePetService,
} from '../services/pet.service';
import { uploadPetProfilePhoto } from '../services/petPhoto.service';
import { adaptPetResponseToPet } from '../adapters/pet.adapter';
import { callApi } from '../utils/apiHelper';

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;

  // Acciones
  fetchPets: () => Promise<void>;
  fetchPetById: (id: string) => Promise<void>;
  createPet: (petData: PetFormData) => Promise<boolean>;
  getPetById: (id: string) => Pet | undefined;
  clearError: () => void;
  // mockPets: () => void;
  deletePet: (id: string) => Promise<void>;
  uploadPetPhoto: (petId: string, file: File) => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,

  fetchPets: async () => {
    set({ loading: true, error: null });

    const { data: petsResponse, error } = await callApi(() => getPets());

    if (error || !petsResponse) {
      const message = error || 'Error al obtener mascotas';
      toast.error(message);
      set({
        error: message,
        loading: false,
      });
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
      set({
        error: message,
        loading: false,
      });
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
      set({
        error: message,
        loading: false,
      });
      return false;
    }

    const newPet = adaptPetResponseToPet(petResponse);

    // Agregar la nueva mascota al estado
    set((state) => ({
      pets: [...state.pets, newPet],
      loading: false,
      error: null,
    }));

    toast.success('Mascota creada correctamente ✔️');
    return true;
  },

  getPetById: (id: string) => {
    return get().pets.find((pet) => pet.id === id);
  },

  clearError: () => {
    set({ error: null });
  },

  // mockPets: () => {
  //   const mockPet1: Pet = {
  //     id: '6f985ea4-4616-42f2-afa2-a3081b44e0b5',
  //     name: 'La wuf mock',
  //     species: 'Perro',
  //     breed: 'Golden Retriever',
  //     birthDate: '2021-03-15T00:00:00Z',
  //     ageYears: 3,
  //     weightKg: '28',
  //     sex: 'Macho',
  //     photoUrl: null,
  //     notes: 'Mascota de prueba para UI',
  //     healthStatus: 'Saludable',
  //     ownerId: 'mock-owner',
  //     createdAt: '2021-03-15T00:00:00Z',
  //     updatedAt: '2024-01-10T00:00:00Z',
  //   };

  //   const mockPet2: Pet = {
  //     id: 'mock-pet-2',
  //     name: 'Iggy',
  //     species: 'Iguana',
  //     breed: 'Iguana Verde',
  //     birthDate: '2022-06-10T00:00:00Z',
  //     ageYears: 2,
  //     weightKg: '1.5',
  //     sex: 'Hembra',
  //     photoUrl: null,
  //     notes: 'Iguana muy tranquila y amigable',
  //     healthStatus: 'Saludable',
  //     ownerId: 'mock-owner',
  //     createdAt: '2022-06-10T00:00:00Z',
  //     updatedAt: '2024-01-15T00:00:00Z',
  //   };

  //   set({
  //     pets: [mockPet1, mockPet2],
  //     loading: false,
  //     error: null,
  //   });

  //   toast.success('Mascotas mock cargadas correctamente ✔️');
  // },

  deletePet: async (id: string) => {
    set({ loading: true, error: null });

    const { error } = await callApi(() => deletePetService(id));

    if (error) {
      const message = error || 'Error al eliminar la mascota';
      toast.error(message);
      set({
        error: message,
        loading: false,
      });
      return;
    }

    set((state) => ({
      pets: state.pets.filter((pet) => pet.id !== id),
      loading: false,
      error: null,
    }));

    toast.success('Mascota eliminada correctamente 🗑️');
  },

  uploadPetPhoto: async (petId: string, file: File) => {
    set({ loading: true, error: null });

    const { data: uploadResponse, error } = await callApi(() =>
      uploadPetProfilePhoto(petId, file),
    );

    if (error || !uploadResponse) {
      const message = error || 'Error al subir la foto';
      toast.error(message);
      set({
        error: message,
        loading: false,
      });
      return;
    }

    // Actualizar el pet en el estado con la nueva photoUrl
    set((state) => {
      const updatedPets = state.pets.map((pet) =>
        pet.id === petId
          ? { ...pet, photoUrl: uploadResponse.url }
          : pet,
      );

      const updatedSelectedPet =
        state.selectedPet?.id === petId
          ? { ...state.selectedPet, photoUrl: uploadResponse.url }
          : state.selectedPet;

      return {
        pets: updatedPets,
        selectedPet: updatedSelectedPet,
        loading: false,
        error: null,
      };
    });

    toast.success('Foto de perfil actualizada correctamente 📸');
  },
}));
