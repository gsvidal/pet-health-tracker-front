import type { Deworming } from '../models/deworming.model';
import type {
  DewormingFormRequest,
  UpdateDewormingRequest,
} from '../types/deworming.type';

/**
 * Schema del backend (snake_case)
 * Según DewormingResponse de la API
 */
export interface DewormingResponse {
  id: string;
  pet_id: string;
  medication?: string | null;
  date_administered: string;
  next_due?: string | null;
  veterinarian?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Schema para crear desparasitación en el backend (snake_case)
 * Según DewormingCreate de la API
 * Requeridos: pet_id, date_administered
 */
export interface DewormingCreateRequest {
  pet_id: string; // requerido
  date_administered: string; // requerido, format: date
  medication?: string | null; // opcional, maxLength: 200
  next_due?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  notes?: string | null; // opcional
}

/**
 * Schema para actualizar desparasitación en el backend (snake_case)
 * Según DewormingUpdate de la API (todos los campos opcionales)
 */
export interface DewormingUpdateRequest {
  medication?: string | null; // opcional, maxLength: 200
  date_administered?: string | null; // opcional, format: date
  next_due?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  notes?: string | null; // opcional
}

/**
 * Adapta DewormingResponse del backend (snake_case) a Deworming del frontend (camelCase)
 */
export function adaptDewormingResponseToDeworming(
  dewormingResponse: DewormingResponse,
): Deworming {
  return {
    id: dewormingResponse.id,
    petId: dewormingResponse.pet_id,
    medication: dewormingResponse.medication,
    dateAdministered: dewormingResponse.date_administered,
    nextDue: dewormingResponse.next_due,
    veterinarian: dewormingResponse.veterinarian,
    notes: dewormingResponse.notes,
    createdAt: dewormingResponse.created_at,
    updatedAt: dewormingResponse.updated_at,
  };
}

/**
 * Adapta datos del frontend (camelCase) a DewormingCreateRequest del backend (snake_case)
 * Para crear una desparasitación
 */
export function adaptDewormingToDewormingCreateRequest(
  deworming: DewormingFormRequest,
  petId: string,
): DewormingCreateRequest {
  return {
    pet_id: petId,
    date_administered: deworming.dateAdministered,
    medication: deworming.medication ?? null,
    next_due: deworming.nextDue ?? null,
    veterinarian: deworming.veterinarian ?? null,
    notes: deworming.notes ?? null,
  };
}

/**
 * Adapta datos del frontend (camelCase) a DewormingUpdateRequest del backend (snake_case)
 * Para actualizar una desparasitación
 */
export function adaptDewormingToDewormingUpdateRequest(
  deworming: UpdateDewormingRequest,
): DewormingUpdateRequest {
  const request: DewormingUpdateRequest = {};
  if (deworming.medication !== undefined)
    request.medication = deworming.medication;
  if (deworming.dateAdministered !== undefined)
    request.date_administered = deworming.dateAdministered;
  if (deworming.nextDue !== undefined) request.next_due = deworming.nextDue;
  if (deworming.veterinarian !== undefined)
    request.veterinarian = deworming.veterinarian;
  if (deworming.notes !== undefined) request.notes = deworming.notes;
  return request;
}
