import { apiClient } from './api.config';
import type { VaccinationResponse } from '../adapters/vaccine.adapter';
import type {
  VaccineFormRequest,
  UpdateVaccineRequest,
} from '../types/vaccine.type';
import {
  adaptVaccineToVaccinationCreateRequest,
  adaptVaccineToVaccinationUpdateRequest,
} from '../adapters/vaccine.adapter';

const VACCINATIONS_ENDPOINT = '/vaccinations';

/**
 * Obtiene todas las vacunas de una mascota
 */
export const getVaccinesByPetId = async (
  petId: string,
): Promise<VaccinationResponse[]> => {
  const response = await apiClient.get<VaccinationResponse[]>(
    VACCINATIONS_ENDPOINT,
    {
      params: {
        pet_id: petId,
      },
    },
  );
  return response.data;
};

/**
 * Obtiene una vacuna por ID
 */
export const getVaccineById = async (
  id: string,
): Promise<VaccinationResponse> => {
  const response = await apiClient.get<VaccinationResponse>(
    `${VACCINATIONS_ENDPOINT}/${id}`,
  );
  return response.data;
};

/**
 * Crea una nueva vacuna para una mascota
 */
export const createVaccine = async (
  petId: string,
  data: VaccineFormRequest,
): Promise<VaccinationResponse> => {
  const requestData = adaptVaccineToVaccinationCreateRequest(data, petId);
  const response = await apiClient.post<VaccinationResponse>(
    VACCINATIONS_ENDPOINT,
    requestData,
  );
  return response.data;
};

/**
 * Actualiza una vacuna
 */
export const updateVaccine = async (
  id: string,
  data: UpdateVaccineRequest,
): Promise<VaccinationResponse> => {
  const requestData = adaptVaccineToVaccinationUpdateRequest(data);
  const response = await apiClient.put<VaccinationResponse>(
    `${VACCINATIONS_ENDPOINT}/${id}`,
    requestData,
  );
  return response.data;
};

/**
 * Elimina una vacuna
 */
export const deleteVaccine = async (id: string): Promise<void> => {
  await apiClient.delete(`${VACCINATIONS_ENDPOINT}/${id}`);
};
