import { apiClient } from './api.config';
import type { VetVisitResponse } from '../adapters/vetVisit.adapter';
import type {
  VetVisitFormRequest,
  UpdateVetVisitRequest,
} from '../types/vetVisit.type';
import {
  adaptVetVisitToVetVisitCreateRequest,
  adaptVetVisitToVetVisitUpdateRequest,
} from '../adapters/vetVisit.adapter';

const VET_VISITS_ENDPOINT = '/vet-visits';

/**
 * Obtiene todas las visitas veterinarias de una mascota
 */
export const getVetVisitsByPetId = async (
  petId: string,
): Promise<VetVisitResponse[]> => {
  const response = await apiClient.get<VetVisitResponse[]>(
    VET_VISITS_ENDPOINT,
    {
      params: {
        pet_id: petId,
      },
    },
  );
  return response.data;
};

/**
 * Obtiene una visita veterinaria por ID
 */
export const getVetVisitById = async (
  id: string,
): Promise<VetVisitResponse> => {
  const response = await apiClient.get<VetVisitResponse>(
    `${VET_VISITS_ENDPOINT}/${id}`,
  );
  return response.data;
};

/**
 * Crea una nueva visita veterinaria para una mascota
 */
export const createVetVisit = async (
  petId: string,
  data: VetVisitFormRequest,
): Promise<VetVisitResponse> => {
  const requestData = adaptVetVisitToVetVisitCreateRequest(data, petId);
  const response = await apiClient.post<VetVisitResponse>(
    VET_VISITS_ENDPOINT,
    requestData,
  );
  return response.data;
};

/**
 * Actualiza una visita veterinaria
 */
export const updateVetVisit = async (
  id: string,
  data: UpdateVetVisitRequest,
): Promise<VetVisitResponse> => {
  const requestData = adaptVetVisitToVetVisitUpdateRequest(data);
  const response = await apiClient.put<VetVisitResponse>(
    `${VET_VISITS_ENDPOINT}/${id}`,
    requestData,
  );
  return response.data;
};

/**
 * Elimina una visita veterinaria
 */
export const deleteVetVisit = async (id: string): Promise<void> => {
  await apiClient.delete(`${VET_VISITS_ENDPOINT}/${id}`);
};
