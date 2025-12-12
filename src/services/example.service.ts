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
  const response = await apiClient.get<ContactFormResponse[]>(CONTACT_ENDPOINT);
  return response.data;
};

/**
 * Obtiene un formulario por ID
 */
export const getSubmissionById = async (
  id: string,
): Promise<ContactFormResponse> => {
  const response = await apiClient.get<ContactFormResponse>(
    `${CONTACT_ENDPOINT}/${id}`,
  );
  return response.data;
};

/**
 * Crea un nuevo formulario de contacto
 */
export const submitContactForm = async (
  data: ContactFormRequest,
): Promise<ContactFormResponse> => {
  const response = await apiClient.post<ContactFormResponse>(
    CONTACT_ENDPOINT,
    data,
  );
  return response.data;
};

/**
 * Actualiza un formulario de contacto
 */
export const updateSubmission = async (
  id: string,
  data: UpdateContactFormRequest,
): Promise<ContactFormResponse> => {
  const response = await apiClient.put<ContactFormResponse>(
    `${CONTACT_ENDPOINT}/${id}`,
    data,
  );
  return response.data;
};

/**
 * Elimina un formulario de contacto
 */
export const deleteSubmission = async (id: string): Promise<void> => {
  await apiClient.delete(`${CONTACT_ENDPOINT}/${id}`);
};
