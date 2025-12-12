import type { VetVisit } from '../models/vetVisit.model';
import type {
  VetVisitFormRequest,
  UpdateVetVisitRequest,
} from '../types/vetVisit.type';

/**
 * Schema del backend (snake_case)
 * Según VetVisitResponse de la API
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
 * Schema para crear visita en el backend (snake_case)
 * Según VetVisitCreate de la API
 * Requeridos: pet_id, visit_date
 */
export interface VetVisitCreateRequest {
  pet_id: string; // requerido
  visit_date: string; // requerido, format: date-time
  reason?: string | null; // opcional
  diagnosis?: string | null; // opcional
  treatment?: string | null; // opcional
  follow_up_date?: string | null; // opcional, format: date-time
  veterinarian?: string | null; // opcional, maxLength: 200
  documents_id?: string | null; // opcional
}

/**
 * Schema para actualizar visita en el backend (snake_case)
 * Según VetVisitUpdate de la API (todos los campos opcionales)
 */
export interface VetVisitUpdateRequest {
  visit_date?: string | null; // opcional, format: date-time
  reason?: string | null; // opcional
  diagnosis?: string | null; // opcional
  treatment?: string | null; // opcional
  follow_up_date?: string | null; // opcional, format: date-time
  veterinarian?: string | null; // opcional, maxLength: 200
  documents_id?: string | null; // opcional
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

/**
 * Adapta datos del frontend (camelCase) a VetVisitCreateRequest del backend (snake_case)
 * Para crear una visita
 */
export function adaptVetVisitToVetVisitCreateRequest(
  vetVisit: VetVisitFormRequest,
  petId: string,
): VetVisitCreateRequest {
  // visitDate ya viene en formato ISO desde el hook
  const visitDateISO = vetVisit.visitDate || new Date().toISOString();

  // followUpDate ya viene en formato ISO o null desde el hook
  const followUpDateISO = vetVisit.followUpDate || null;

  return {
    pet_id: petId,
    visit_date: visitDateISO,
    reason: vetVisit.reason ?? null,
    diagnosis: vetVisit.diagnosis ?? null,
    treatment: vetVisit.treatment ?? null,
    follow_up_date: followUpDateISO,
    veterinarian: vetVisit.veterinarian ?? null,
    documents_id: vetVisit.documentsId ?? null,
  };
}

/**
 * Adapta datos del frontend (camelCase) a VetVisitUpdateRequest del backend (snake_case)
 * Para actualizar una visita
 */
export function adaptVetVisitToVetVisitUpdateRequest(
  vetVisit: UpdateVetVisitRequest,
): VetVisitUpdateRequest {
  const request: VetVisitUpdateRequest = {};

  if (vetVisit.visitDate !== undefined) {
    // visitDate ya viene en formato ISO desde el hook
    request.visit_date = vetVisit.visitDate || null;
  }

  if (vetVisit.reason !== undefined) request.reason = vetVisit.reason;
  if (vetVisit.diagnosis !== undefined) request.diagnosis = vetVisit.diagnosis;
  if (vetVisit.treatment !== undefined) request.treatment = vetVisit.treatment;

  if (vetVisit.followUpDate !== undefined) {
    // followUpDate ya viene en formato ISO desde el hook
    request.follow_up_date = vetVisit.followUpDate || null;
  }

  if (vetVisit.veterinarian !== undefined)
    request.veterinarian = vetVisit.veterinarian;
  if (vetVisit.documentsId !== undefined)
    request.documents_id = vetVisit.documentsId;

  return request;
}
