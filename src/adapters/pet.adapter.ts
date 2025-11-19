import type { Pet } from '../models/pet.model';

/**
 * Schema del backend (snake_case)
 */
export interface PetResponse {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  birth_date?: string | null;
  age_years?: number | null;
  weight_kg?: string | null;
  sex?: string | null;
  photo_url?: string | null;
  notes?: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Adapta PetResponse del backend (snake_case) a Pet del frontend (camelCase)
 */
export function adaptPetResponseToPet(petResponse: PetResponse): Pet {
  return {
    id: petResponse.id,
    name: petResponse.name,
    species: petResponse.species,
    breed: petResponse.breed,
    birthDate: petResponse.birth_date,
    ageYears: petResponse.age_years,
    weightKg: petResponse.weight_kg,
    sex: petResponse.sex,
    photoUrl: petResponse.photo_url,
    notes: petResponse.notes,
    ownerId: petResponse.owner_id,
    createdAt: petResponse.created_at,
    updatedAt: petResponse.updated_at,
  };
}
