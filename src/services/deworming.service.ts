import { apiClient } from './api.config';
import type { DewormingResponse } from '../adapters/deworming.adapter';
import type {
  DewormingFormRequest,
  UpdateDewormingRequest,
} from '../types/deworming.type';
import {
  adaptDewormingToDewormingCreateRequest,
  adaptDewormingToDewormingUpdateRequest,
} from '../adapters/deworming.adapter';

const DEWORMINGS_ENDPOINT = '/dewormings';

/**
 * Obtiene todas las desparasitaciones de una mascota
 */
export const getDewormingsByPetId = async (
  petId: string,
): Promise<DewormingResponse[]> => {
  const response = await apiClient.get<DewormingResponse[]>(
    DEWORMINGS_ENDPOINT,
    {
      params: {
        pet_id: petId,
      },
    },
  );
  return response.data;
};

/**
 * Obtiene una desparasitación por ID
 */
export const getDewormingById = async (
  id: string,
): Promise<DewormingResponse> => {
  const response = await apiClient.get<DewormingResponse>(
    `${DEWORMINGS_ENDPOINT}/${id}`,
  );
  return response.data;
};

/**
 * Crea una nueva desparasitación para una mascota
 */
export const createDeworming = async (
  petId: string,
  data: DewormingFormRequest,
): Promise<DewormingResponse> => {
  const requestData = adaptDewormingToDewormingCreateRequest(data, petId);
  const response = await apiClient.post<DewormingResponse>(
    DEWORMINGS_ENDPOINT,
    requestData,
  );
  return response.data;
};

/**
 * Actualiza una desparasitación
 */
export const updateDeworming = async (
  id: string,
  data: UpdateDewormingRequest,
): Promise<DewormingResponse> => {
  const requestData = adaptDewormingToDewormingUpdateRequest(data);
  const response = await apiClient.put<DewormingResponse>(
    `${DEWORMINGS_ENDPOINT}/${id}`,
    requestData,
  );
  return response.data;
};

/**
 * Elimina una desparasitación
 */
export const deleteDeworming = async (id: string): Promise<void> => {
  await apiClient.delete(`${DEWORMINGS_ENDPOINT}/${id}`);
};

