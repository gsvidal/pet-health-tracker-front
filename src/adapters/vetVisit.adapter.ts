import type { VetVisit } from '../models/vetVisit.model';

/**
 * Schema del backend (snake_case)
 */
export interface VetVisitResponse {
  id: string;
  pet_id: string;
  visit_date: string;
  reason?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  follow_up_date?: string | null;
  veterinarian?: string | null;
  documents_id?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Adapta VetVisitResponse del backend (snake_case) a VetVisit del frontend (camelCase)
 */
export function adaptVetVisitResponseToVetVisit(
  vetVisitResponse: VetVisitResponse,
): VetVisit {
  return {
    id: vetVisitResponse.id,
    petId: vetVisitResponse.pet_id,
    visitDate: vetVisitResponse.visit_date,
    reason: vetVisitResponse.reason,
    diagnosis: vetVisitResponse.diagnosis,
    treatment: vetVisitResponse.treatment,
    followUpDate: vetVisitResponse.follow_up_date,
    veterinarian: vetVisitResponse.veterinarian,
    documentsId: vetVisitResponse.documents_id,
    createdAt: vetVisitResponse.created_at,
    updatedAt: vetVisitResponse.updated_at,
  };
}
