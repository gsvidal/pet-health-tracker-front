import { apiClient } from './api.config';
import type { PetResponse } from '../adapters/pet.adapter';

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
