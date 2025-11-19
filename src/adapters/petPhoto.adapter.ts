import type { PetPhoto } from '../models/petPhoto.model';

/**
 * Schema del backend (snake_case)
 */
export interface PetPhotoResponse {
  id: string;
  pet_id: string;
  file_name?: string | null;
  file_size_bytes?: number | null;
  mime_type?: string | null;
  url?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Adapta PetPhotoResponse del backend (snake_case) a PetPhoto del frontend (camelCase)
 */
export function adaptPetPhotoResponseToPetPhoto(
  petPhotoResponse: PetPhotoResponse,
): PetPhoto {
  return {
    id: petPhotoResponse.id,
    petId: petPhotoResponse.pet_id,
    fileName: petPhotoResponse.file_name,
    fileSizeBytes: petPhotoResponse.file_size_bytes,
    mimeType: petPhotoResponse.mime_type,
    url: petPhotoResponse.url,
    createdAt: petPhotoResponse.created_at,
    updatedAt: petPhotoResponse.updated_at,
  };
}
