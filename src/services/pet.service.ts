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

//  Elimina una mascota

export const deletePet = async (id: string): Promise<void> => {
  await apiClient.delete(`${PETS_ENDPOINT}/${id}`);
};

//  Actualiza una mascota por ID
export const updatePetService = async (id: string, petData: PetFormData) => {
  const requestData = adaptPetToPetRequest(petData);

  const response = await apiClient.put(`${PETS_ENDPOINT}/${id}`, requestData);
  return response.data;
};

/**
 * SUBIR FOTO DE PERFIL
 */
export const uploadPetProfilePhoto = async (petId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(
    `${PETS_ENDPOINT}/${petId}/profile`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return response.data;
};

/**
 * SUBIR FOTOS DE GALERÍA (hasta 5)
 */
export const uploadPetGalleryPhotos = async (petId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await apiClient.post(
    `${PETS_ENDPOINT}/${petId}/gallery`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return response.data;
};

/**
 * OBTENER TODAS LAS FOTOS DE UNA MASCOTA
 */
export const getPetPhotos = async (
  petId: string,
): Promise<
  Array<{
    photo_id: string;
    type: 'profile' | 'gallery';
    url: string;
  }>
> => {
  const response = await apiClient.get(`${PETS_ENDPOINT}/${petId}`);
  return response.data;
};

/**
 * ELIMINAR UNA FOTO
 */
export const deletePetPhoto = async (petId: string, photoId: string) => {
  await apiClient.delete(`${PETS_ENDPOINT}/${petId}/photos/${photoId}`);
};

/**
 * ELIMINAR TODAS LAS FOTOS
 */
export const deleteAllPetPhotos = async (petId: string) => {
  await apiClient.delete(`${PETS_ENDPOINT}/${petId}/photos`);
};
