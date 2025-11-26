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
 * Datos del formulario en el frontend (camelCase)
 * Representa el estado local del formulario de creación/edición de mascota
 * Los campos opcionales pueden ser string vacío o null (se normalizan al enviar)
 */
export interface PetFormData {
  name: string;
  species: string;
  breed?: string | null;
  birthDate?: string | null;
  ageYears?: number | null;
  weightKg?: string | null;
  sex?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
}

/**
 * Estado del formulario (valores como strings para inputs de React)
 * Se convierte a PetFormData antes de enviar
 */
export interface PetFormState {
  name: string;
  species: string;
  breed: string;
  sex: string;
  birthDate: string;
  ageYears: string;
  weightKg: string;
  photoUrl: string;
  notes: string;
}

/**
 * Schema para crear/actualizar mascota en el backend (snake_case)
 * No incluye campos generados por el backend (id, owner_id, created_at, updated_at)
 */
export interface PetRequest {
  name: string;
  species: string;
  breed?: string | null;
  birth_date?: string | null;
  age_years?: number | null;
  weight_kg?: string | null;
  sex?: string | null;
  photo_url?: string | null;
  notes?: string | null;
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

/**
 * Adapta datos del frontend (camelCase) a PetRequest del backend (snake_case)
 * Para crear o actualizar una mascota
 */
export function adaptPetToPetRequest(pet: PetFormData): PetRequest {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? null,
    birth_date: pet.birthDate ?? null,
    age_years: pet.ageYears ?? null,
    weight_kg: pet.weightKg ?? null,
    sex: pet.sex ?? null,
    photo_url: pet.photoUrl ?? null,
    notes: pet.notes ?? null,
  };
}
