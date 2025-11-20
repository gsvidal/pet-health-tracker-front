import { apiClient } from './api.config';
import type { PetResponse } from '../adapters/pet.adapter';
import type { createPet } from '../models/pet.model';

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

export const PetForm = async (datos:createPet): Promise<PetResponse[]> => {
  const response = await apiClient.post<PetResponse[]>(PETS_ENDPOINT, datos);
  return response.data;
};