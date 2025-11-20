import type { Vaccine } from '../models/vaccine.model';

/**
 * Schema del backend (snake_case)
 */
export interface VaccinationResponse {
  id: string;
  pet_id: string;
  vaccine_name: string;
  manufacturer?: string | null;
  lot_number?: string | null;
  date_administered: string;
  next_due?: string | null;
  veterinarian?: string | null;
  notes?: string | null;
  proof_document_id?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Adapta VaccinationResponse del backend (snake_case) a Vaccine del frontend (camelCase)
 */
export function adaptVaccinationResponseToVaccine(
  vaccinationResponse: VaccinationResponse,
): Vaccine {
  return {
    id: vaccinationResponse.id,
    petId: vaccinationResponse.pet_id,
    vaccineName: vaccinationResponse.vaccine_name,
    manufacturer: vaccinationResponse.manufacturer,
    lotNumber: vaccinationResponse.lot_number,
    dateAdministered: vaccinationResponse.date_administered,
    nextDue: vaccinationResponse.next_due,
    veterinarian: vaccinationResponse.veterinarian,
    notes: vaccinationResponse.notes,
    proofDocumentId: vaccinationResponse.proof_document_id,
    createdAt: vaccinationResponse.created_at,
    updatedAt: vaccinationResponse.updated_at,
  };
}
