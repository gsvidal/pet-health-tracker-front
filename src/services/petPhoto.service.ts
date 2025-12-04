import { apiClient } from './api.config';

const IMAGES_ENDPOINT = '/images';

/**
 * Sube o actualiza la foto de perfil de una mascota
 * @param petId - ID de la mascota
 * @param file - Archivo de imagen (máximo 5MB)
 * @returns Respuesta con la URL de la imagen subida
 */
export interface ImageUploadResponse {
  url: string;
  key: string;
  size: number;
  bucket: string;
  photo_id?: string | null;
}

export const uploadPetProfilePhoto = async (
  petId: string,
  file: File,
): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ImageUploadResponse>(
    `${IMAGES_ENDPOINT}/pets/${petId}/profile`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};
