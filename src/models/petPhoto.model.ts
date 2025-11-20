export interface PetPhoto {
  id: string;
  petId: string;
  fileName?: string | null;
  fileSizeBytes?: number | null;
  mimeType?: string | null;
  url?: string | null;
  createdAt: string;
  updatedAt: string;
}

