import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type {
  ContactFormRequest,
  ContactFormResponse,
  UpdateContactFormRequest,
} from '../types/example.type';
import { callApi } from '../utils/apiHelper';
import * as exampleService from '../services/example.service';

interface ExampleState {
  submissions: ContactFormResponse[];
  selectedSubmission: ContactFormResponse | null;
  loading: boolean;
  error: string | null;

  // CREATE
  createSubmission: (data: ContactFormRequest) => Promise<void>;

  // READ
  fetchSubmissions: () => Promise<void>;
  fetchSubmissionById: (id: string) => Promise<void>;

  // UPDATE
  updateSubmission: (
    id: string,
    data: UpdateContactFormRequest,
  ) => Promise<void>;

  // DELETE
  deleteSubmission: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
  setSelectedSubmission: (submission: ContactFormResponse | null) => void;
  getSubmissionById: (id: string) => ContactFormResponse | undefined;
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  submissions: [],
  selectedSubmission: null,
  loading: false,
  error: null,

  // CREATE
  createSubmission: async (data: ContactFormRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      exampleService.submitContactForm(data),
    );

    if (error || !response) {
      const message = error || 'Error al crear el formulario';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    // Agregar la nueva submission al estado
    set((state) => ({
      submissions: [...state.submissions, response],
      loading: false,
      error: null,
    }));

    toast.success('Formulario enviado correctamente ✔️');
  },

  // READ - All
  fetchSubmissions: async () => {
    set({ loading: true, error: null });

    const { data: submissions, error } = await callApi(() =>
      exampleService.getSubmissions(),
    );

    if (error || !submissions) {
      const message = error || 'Error al obtener formularios';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    set({
      submissions,
      loading: false,
      error: null,
    });
  },

  // READ - By ID
  fetchSubmissionById: async (id: string) => {
    set({ loading: true, error: null });

    const { data: submission, error } = await callApi(() =>
      exampleService.getSubmissionById(id),
    );

    if (error || !submission) {
      const message = error || 'Error al obtener el formulario';
      toast.error(message);
      set({ loading: false, error: message });
      return;
    }

    set({
      selectedSubmission: submission,
      loading: false,
      error: null,
    });
  },

  // UPDATE
  updateSubmission: async (id: string, data: UpdateContactFormRequest) => {
    set({ loading: true, error: null });

    const { data: response, error } = await callApi(() =>
      exampleService.updateSubmission(id, data),
    );

    if (error || !response) {
      const message = error || 'Error al actualizar el formulario';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    // Actualizar en la lista
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? response : s,
      ),
      selectedSubmission:
        state.selectedSubmission?.id === id
          ? response
          : state.selectedSubmission,
      loading: false,
      error: null,
    }));

    toast.success('Formulario actualizado correctamente ✔️');
  },

  // DELETE
  deleteSubmission: async (id: string) => {
    set({ loading: true, error: null });

    const { error } = await callApi(() =>
      exampleService.deleteSubmission(id),
    );

    if (error) {
      const message = error || 'Error al eliminar el formulario';
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }

    // Eliminar de la lista
    set((state) => ({
      submissions: state.submissions.filter((s) => s.id !== id),
      selectedSubmission:
        state.selectedSubmission?.id === id
          ? null
          : state.selectedSubmission,
      loading: false,
      error: null,
    }));

    toast.success('Formulario eliminado correctamente ✔️');
  },

  // Utils
  clearError: () => set({ error: null }),

  setSelectedSubmission: (submission) =>
    set({ selectedSubmission: submission }),

  getSubmissionById: (id: string) => {
    return get().submissions.find((s) => s.id === id);
  },
}));


