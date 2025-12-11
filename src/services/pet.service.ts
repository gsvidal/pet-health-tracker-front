import { apiClient } from './api.config';
import type {
  PetResponse,
  PetFormData,
  PetHealthSummary,
} from '../adapters/pet.adapter';
import { adaptPetToPetRequest } from '../adapters/pet.adapter';

const PETS_ENDPOINT = '/pets';
const IMAGES_ENDPOINT = '/images/pets';

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
 * Obtiene el resumen de salud de una mascota
 */
export const getPetHealthSummary = async (
  petId: string,
): Promise<PetHealthSummary> => {
  const response = await apiClient.get<PetHealthSummary>(
    `${PETS_ENDPOINT}/${petId}/health-summary/`,
  );
  return response.data;
};
/* ---------- IMÁGENES ---------- */

/** SUBIR FOTO DE PERFIL */
export const uploadPetProfilePhoto = async (petId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(
    `${IMAGES_ENDPOINT}/${petId}/profile`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return response.data;
};

/** SUBIR FOTOS DE GALERÍA */
export const uploadPetGalleryPhotos = async (petId: string, files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post(
    `/images/pets/${petId}/gallery`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return response.data;
};

/** OBTENER TODAS LAS FOTOS (solo imágenes, excluye documentos PDF) */
export const getPetPhotos = async (petId: string) => {
  const response = await apiClient.get(`/images/pets/${petId}/photos`);
  const data = response.data;

  type RawPhoto = {
    photo_id?: string;
    id?: string;
    url: string;
    type?: 'profile' | 'gallery';
    file_type?: string; // 'image' o 'document'
    [key: string]: unknown;
  };

  let raw: RawPhoto[] = [];

  if (Array.isArray(data)) {
    raw = data;
  } else if (Array.isArray(data.photos)) {
    raw = data.photos;
  } else if (Array.isArray(data.images)) {
    raw = data.images;
  } else if (Array.isArray(data.gallery)) {
    raw = data.gallery;
  }

  // Filtrar solo imágenes (excluir documentos PDF)
  const imagesOnly = raw.filter(
    (item) =>
      item.file_type !== 'document' &&
      item.file_type !== 'Document' &&
      !item.document_category, // También filtrar por document_category si existe
  );

  return imagesOnly.map((img: RawPhoto) => ({
    photo_id: img.photo_id ?? img.id ?? '',
    url: img.url,
    type: img.type ?? 'gallery',
  }));
};

/** ELIMINAR UNA FOTO */
export const deletePetPhoto = async (petId: string, photoId: string) => {
  await apiClient.delete(`${IMAGES_ENDPOINT}/${petId}/photos/${photoId}`);
};

/** ELIMINAR TODAS LAS FOTOS */
export const deleteAllPetPhotos = async (petId: string) => {
  await apiClient.delete(`${IMAGES_ENDPOINT}/${petId}/photos`);
};

/* ---------- DOCUMENTOS PDF ---------- */

export interface DocumentUploadResponse {
  url: string;
  key: string;
  size: number;
  bucket: string;
  photo_id?: string | null;
  file_type?: string;
  document_category?: string | null;
}

export interface PetDocument {
  id: string;
  pet_id: string;
  url: string;
  key: string;
  size: number;
  last_modified: string;
  photo_id?: string;
  file_name?: string | null;
  file_size_bytes?: number | null;
  mime_type?: string | null;
  created_at?: string | null;
  is_profile?: boolean;
  file_type?: string;
  document_category?: string | null;
  description?: string | null;
}

/**
 * Sube un documento PDF para una mascota
 */
export const uploadPetDocument = async (
  petId: string,
  file: File,
  documentCategory: string,
  description?: string | null,
): Promise<DocumentUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_category', documentCategory);
  if (description) {
    formData.append('description', description);
  }

  const response = await apiClient.post<DocumentUploadResponse>(
    `${IMAGES_ENDPOINT}/${petId}/documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return response.data;
};

/**
 * Obtiene todos los documentos PDF de una mascota
 */
export const getPetDocuments = async (
  petId: string,
  category?: string | null,
): Promise<PetDocument[]> => {
  const params = category ? { category } : {};
  const response = await apiClient.get<PetDocument[]>(
    `${IMAGES_ENDPOINT}/${petId}/documents`,
    { params },
  );

  return response.data;
};
