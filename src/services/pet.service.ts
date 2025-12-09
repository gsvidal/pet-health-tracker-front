import { apiClient } from './api.config';
import type { PetResponse, PetFormData } from '../adapters/pet.adapter';
import { adaptPetToPetRequest } from '../adapters/pet.adapter';

const PETS_ENDPOINT = '/pets';

/**
 * Obtiene todas las mascotas del usuario autenticado
 */
export const getPets = async (): Promise<PetResponse[]> => {
  const response = await apiClient.get<PetResponse[]>(PETS_ENDPOINT);
  return response.data;
};

/**
 * Obtiene una mascota por ID
 */
export const getPetById = async (id: string): Promise<PetResponse> => {
  const response = await apiClient.get<PetResponse>(`${PETS_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea una nueva mascota
 */
export const createPet = async (petData: PetFormData): Promise<PetResponse> => {
  const requestData = adaptPetToPetRequest(petData);
  const response = await apiClient.post<PetResponse>(
    PETS_ENDPOINT,
    requestData,
  );
  return response.data;
};

/**
 * Actualiza una mascota por ID
 */

export const updatePetService = async (id: string, petData: PetFormData) => {
  const requestData = adaptPetToPetRequest(petData);

  const response = await apiClient.patch(`${PETS_ENDPOINT}/${id}`, requestData);
  return response.data;
};

/**
 * Subir imagenes de mascota por ID
 */
export const uploadPetImages = async (petId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const response = await apiClient.post(
    `${PETS_ENDPOINT}/${petId}/gallery`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

/**
 * Obtener galeria mascota por ID
 */
export const getPetGallery = async (petId: string): Promise<string[]> => {
  const response = await apiClient.get(`${PETS_ENDPOINT}/${petId}/gallery`);
  return response.data.images || [];
};
