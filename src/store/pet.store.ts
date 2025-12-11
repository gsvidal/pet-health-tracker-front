import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Pet } from '../models/pet.model';
import type { PetFormData } from '../adapters/pet.adapter';
import {
  getPets,
  getPetById,
  createPet as createPetService,
  deletePet as deletePetService,
  updatePetService,
  getPetHealthSummary,
} from '../services/pet.service';
import type { PetHealthSummary } from '../adapters/pet.adapter';
import { uploadPetProfilePhoto } from '../services/petPhoto.service';
import { adaptPetResponseToPet } from '../adapters/pet.adapter';
import { callApi } from '../utils/apiHelper';
import {
  uploadPetDocument as uploadPetDocumentService,
  getPetDocuments,
  type PetDocument,
} from '../services/pet.service';

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  mockMode: boolean;
  documents: PetDocument[];
  documentsLoading: boolean;

  // Acciones
  fetchPets: () => Promise<void>;
  fetchPetById: (id: string) => Promise<void>;
  createPet: (petData: PetFormData) => Promise<boolean>;
  getPetById: (id: string) => Pet | undefined;
  clearError: () => void;
  // mockPets: () => void;
  deletePet: (id: string) => Promise<void>;
  uploadPetPhoto: (petId: string, file: File) => Promise<void>;
  // mockPets: () => void;
  updatePet: (id: string, petData: PetFormData) => Promise<void>;
  getPetHealthStatus: (petId: string) => Promise<PetHealthSummary | null>;
  uploadPetDocument: (
    petId: string,
    file: File,
    documentCategory: string,
    description?: string | null,
  ) => Promise<void>;
  fetchPetDocuments: (petId: string, category?: string | null) => Promise<void>;
  // setMockMode: (value: boolean) => void;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,
  mockMode: false,
  documents: [],
  documentsLoading: false,
  // setMockMode: (value) => set({ mockMode: value }),

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

    // Ordenar por fecha de creación descendente (más recientes primero)
    const sortedPets = pets.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descendente
    });

    set({
      pets: sortedPets,
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
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
    }

    const newPet = adaptPetResponseToPet(petResponse);

    // Agregar la nueva mascota al principio del array (más reciente primero)
    set((state) => ({
      pets: [newPet, ...state.pets],
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
        pet.id === petId ? { ...pet, photoUrl: uploadResponse.url } : pet,
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

  getPetHealthStatus: async (petId: string) => {
    const { data: healthSummary, error } = await callApi(() =>
      getPetHealthSummary(petId),
    );

    if (error || !healthSummary) {
      // No mostrar error, solo retornar null para que el hook maneje el fallback
      return null;
    }

    return healthSummary;
  },

  uploadPetDocument: async (
    petId: string,
    file: File,
    documentCategory: string,
    description?: string | null,
  ) => {
    set({ loading: true, error: null });

    const { data: uploadResponse, error } = await callApi(() =>
      uploadPetDocumentService(petId, file, documentCategory, description),
    );

    if (error || !uploadResponse) {
      const message = error || 'Error al subir el documento';
      toast.error(message);
      set({
        error: message,
        loading: false,
      });
      return;
    }

    // Agregar el nuevo documento al estado
    const newDocument: PetDocument = {
      id: uploadResponse.photo_id || undefined,
      photo_id: uploadResponse.photo_id || undefined,
      url: uploadResponse.url,
      document_category: uploadResponse.document_category || null,
      file_type: uploadResponse.file_type,
      file_size_bytes: uploadResponse.size,
    };

    set((state) => ({
      documents: [...state.documents, newDocument],
      loading: false,
      error: null,
    }));

    toast.success('Documento subido correctamente 📄');
  },

  fetchPetDocuments: async (petId: string, category?: string | null) => {
    set({ documentsLoading: true, error: null });

    const { data: documents, error } = await callApi(() =>
      getPetDocuments(petId, category),
    );

    if (error || !documents) {
      const message = error || 'Error al obtener documentos';
      // No mostrar toast para evitar spam, solo log
      console.error(message);
      set({ documents: [], documentsLoading: false, error: message });
      return;
    }

    set({
      documents,
      documentsLoading: false,
      error: null,
    });
  },
}));
