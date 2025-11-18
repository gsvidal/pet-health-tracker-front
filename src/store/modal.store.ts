import { create } from 'zustand';
import type { ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string | null;
  content: ReactNode | null;
  onClose: (() => void) | null;

  // Acciones
  openModal: (config: {
    title?: string;
    content: ReactNode;
    onClose?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: null,
  content: null,
  onClose: null,

  openModal: ({ title, content, onClose }) => {
    set({
      isOpen: true,
      title: title || null,
      content,
      onClose: onClose || null,
    });
  },

  closeModal: () => {
    set((state) => {
      // Ejecutar callback si existe
      if (state.onClose) {
        state.onClose();
      }
      return {
        isOpen: false,
        title: null,
        content: null,
        onClose: null,
      };
    });
  },
}));

