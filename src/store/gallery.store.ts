import { create } from 'zustand';

interface GalleryModalState {
  isOpen: boolean;
  mode: 'upload' | 'view' | null;
  images: string[];
  current: number;
  petId: string | null;

  openUpload: (petId: string) => void;
  openView: (petId: string, images: string[]) => void;
  close: () => void;
}

export const useGalleryModalStore = create<GalleryModalState>((set) => ({
  isOpen: false,
  mode: null,
  images: [],
  current: 0,
  petId: null,

  openUpload: (petId) => set({ isOpen: true, mode: 'upload', petId }),

  openView: (petId, images) =>
    set({ isOpen: true, mode: 'view', petId, images, current: 0 }),

  close: () => set({ isOpen: false, mode: null, images: [] }),
}));
