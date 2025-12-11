import { create } from 'zustand';
import type { PetDocument } from '../services/pet.service';

interface DocumentModalState {
  isOpen: boolean;
  mode: 'upload' | 'view' | null;
  documents: PetDocument[];
  current: number;
  petId: string | null;

  openUpload: (petId: string) => void;
  openView: (petId: string, documents: PetDocument[]) => void;
  close: () => void;
}

export const useDocumentModalStore = create<DocumentModalState>((set) => ({
  isOpen: false,
  mode: null,
  documents: [],
  current: 0,
  petId: null,

  openUpload: (petId) =>
    set({ isOpen: true, mode: 'upload', petId, current: 0 }),

  openView: (petId, documents) =>
    set({ isOpen: true, mode: 'view', petId, documents, current: 0 }),

  close: () =>
    set({
      isOpen: false,
      mode: null,
      documents: [],
      petId: null,
      current: 0,
    }),
}));
