import { create } from 'zustand';

interface PhotoItem {
  photo_id: string;
  type: 'profile' | 'gallery';
  url: string;
}

interface GalleryModalState {
  isOpen: boolean;
  mode: 'upload' | 'view' | null;
  photos: PhotoItem[];
  current: number;
  petId: string | null;

  openUpload: (petId: string) => void;
  openView: (petId: string, photos: PhotoItem[]) => void;
  close: () => void;
}

export const useGalleryModalStore = create<GalleryModalState>((set) => ({
  isOpen: false,
  mode: null,
  photos: [],
  current: 0,
  petId: null,

  openUpload: (petId) =>
    set({ isOpen: true, mode: 'upload', petId, current: 0 }),

  openView: (petId, photos) =>
    set({ isOpen: true, mode: 'view', petId, photos, current: 0 }),

  close: () =>
    set({
      isOpen: false,
      mode: null,
      photos: [],
      petId: null,
      current: 0,
    }),
}));
