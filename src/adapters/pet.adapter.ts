import type { Pet } from '../models/pet.model';
import { normalizeSexValue } from '../utils/sexUtils';

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
 * Nota: ageYears no se incluye porque el backend lo calcula automáticamente
 */
export interface PetFormState {
  name: string;
  species: string;
  breed: string;
  sex: string;
  birthDate: string;
  weightKg: string;
  photoUrl: string;
  notes: string;
}

/**
 * Schema para crear/actualizar mascota en el backend (snake_case)
 * No incluye campos generados por el backend (id, owner_id, created_at, updated_at)
 * Para UPDATE: todos los campos son opcionales según la API
 */
export interface PetRequest {
  name?: string | null;
  species?: string | null;
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
    healthStatus: null,
  };
}

/**
 * Adapta datos del frontend (camelCase) a PetRequest del backend (snake_case)
 * Para crear o actualizar una mascota
 * Convierte strings vacíos a null y solo incluye campos con valor
 */
export function adaptPetToPetRequest(pet: PetFormData): PetRequest {
  const request: PetRequest = {};

  // Solo incluir campos que tienen valor (no vacíos o null)
  // Para update, todos son opcionales según la API
  if (pet.name !== undefined && pet.name !== null && pet.name.trim() !== '') {
    request.name = pet.name;
  } else if (pet.name !== undefined) {
    request.name = null;
  }

  if (
    pet.species !== undefined &&
    pet.species !== null &&
    pet.species.trim() !== ''
  ) {
    request.species = pet.species;
  } else if (pet.species !== undefined) {
    request.species = null;
  }

  if (pet.breed !== undefined) {
    request.breed = pet.breed && pet.breed.trim() !== '' ? pet.breed : null;
  }

  if (pet.birthDate !== undefined) {
    request.birth_date =
      pet.birthDate && pet.birthDate.trim() !== '' ? pet.birthDate : null;
  }

  // ageYears no se envía porque el backend lo calcula automáticamente desde birthDate
  // if (pet.ageYears !== undefined) {
  //   request.age_years = pet.ageYears !== null ? pet.ageYears : null;
  // }

  if (pet.weightKg !== undefined) {
    request.weight_kg =
      pet.weightKg && pet.weightKg.trim() !== '' ? pet.weightKg : null;
  }

  if (pet.sex !== undefined) {
    // Normalizar el valor de sex al formato que espera el backend (Macho, Hembra, Otro)
    const normalizedSex = pet.sex && pet.sex.trim() !== '' 
      ? normalizeSexValue(pet.sex) 
      : null;
    request.sex = normalizedSex;
  }

  if (pet.photoUrl !== undefined) {
    request.photo_url =
      pet.photoUrl && pet.photoUrl.trim() !== '' ? pet.photoUrl : null;
  }

  if (pet.notes !== undefined) {
    request.notes = pet.notes && pet.notes.trim() !== '' ? pet.notes : null;
  }

  return request;
}

/**
 * Interfaz para el health summary del backend
 */
export interface PetHealthSummary {
  pet_id: string;
  pet_name: string;
  last_vaccination: {
    vaccine_name: string;
    date: string;
  } | null;
  next_vaccination_due: {
    vaccine_name: string;
    due_date: string;
  } | null;
  last_deworming: {
    medication: string;
    date: string;
  } | null;
  last_vet_visit: {
    date: string;
    reason: string | null;
  } | null;
  upcoming_reminders: any[];
}
