import type { Deworming } from '../models/deworming.model';

/**
 * Schema del backend (snake_case)
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
