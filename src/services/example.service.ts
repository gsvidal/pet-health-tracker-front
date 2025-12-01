import { apiClient } from './api.config';
import type {
  ContactFormRequest,
  ContactFormResponse,
  UpdateContactFormRequest,
} from '../types/example.type';

const CONTACT_ENDPOINT = '/contact';

/**
 * Obtiene todos los formularios de contacto
 */
export const getSubmissions = async (): Promise<ContactFormResponse[]> => {
  // Mock para testing - en producción usar:
  // const response = await apiClient.get<ContactFormResponse[]>(CONTACT_ENDPOINT);
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          subject: 'Consulta sobre servicios',
          message: 'Quisiera más información',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'pending',
        },
      ]);
    }, 500);
  });
};

/**
 * Obtiene un formulario por ID
 */
export const getSubmissionById = async (
  id: string,
): Promise<ContactFormResponse> => {
  // Mock para testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        subject: 'Consulta sobre servicios',
        message: 'Quisiera más información',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending',
      });
    }, 500);
  });

  // En producción:
  // const response = await apiClient.get<ContactFormResponse>(
  //   `${CONTACT_ENDPOINT}/${id}`,
  // );
  // return response.data;
};

/**
 * Crea un nuevo formulario de contacto
 */
export const submitContactForm = async (
  data: ContactFormRequest,
): Promise<ContactFormResponse> => {
  // Mock para testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `contact-${Date.now()}`,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending',
      });
    }, 1000);
  });

  // En producción:
  // const response = await apiClient.post<ContactFormResponse>(
  //   CONTACT_ENDPOINT,
  //   data,
  // );
  // return response.data;
};

/**
 * Actualiza un formulario de contacto
 */
export const updateSubmission = async (
  id: string,
  data: UpdateContactFormRequest,
): Promise<ContactFormResponse> => {
  // Mock para testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: data.name || 'Juan Pérez',
        email: data.email || 'juan@example.com',
        subject: data.subject || 'Consulta actualizada',
        message: data.message || 'Mensaje actualizado',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'read',
      });
    }, 800);
  });

  // En producción:
  // const response = await apiClient.put<ContactFormResponse>(
  //   `${CONTACT_ENDPOINT}/${id}`,
  //   data,
  // );
  // return response.data;
};

/**
 * Elimina un formulario de contacto
 */
export const deleteSubmission = async (id: string): Promise<void> => {
  // Mock para testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });

  // En producción:
  // await apiClient.delete(`${CONTACT_ENDPOINT}/${id}`);
};


