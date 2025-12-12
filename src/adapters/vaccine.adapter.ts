import type { Vaccine } from '../models/vaccine.model';
import type {
  VaccineFormRequest,
  UpdateVaccineRequest,
} from '../types/vaccine.type';

/**
 * Schema del backend (snake_case)
 */
/**
 * Schema del backend (snake_case)
 * Según VaccinationResponse de la API
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
 * Schema para crear vacuna en el backend (snake_case)
 * Según VaccinationCreate de la API
 * Requeridos: pet_id, vaccine_name, date_administered
 */
export interface VaccinationCreateRequest {
  pet_id: string; // requerido
  vaccine_name: string; // requerido, minLength: 1, maxLength: 200
  date_administered: string; // requerido, format: date
  manufacturer?: string | null; // opcional, maxLength: 200
  lot_number?: string | null; // opcional, maxLength: 100
  next_due?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  notes?: string | null; // opcional
  proof_document_id?: string | null; // opcional
}

/**
 * Schema para actualizar vacuna en el backend (snake_case)
 * Según VaccinationUpdate de la API (todos los campos opcionales)
 */
export interface VaccinationUpdateRequest {
  vaccine_name?: string | null; // opcional, minLength: 1, maxLength: 200
  date_administered?: string | null; // opcional, format: date
  next_due?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  manufacturer?: string | null; // opcional, maxLength: 200
  lot_number?: string | null; // opcional, maxLength: 100
  notes?: string | null; // opcional
  proof_document_id?: string | null; // opcional
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

/**
 * Adapta datos del frontend (camelCase) a VaccinationCreateRequest del backend (snake_case)
 * Para crear una vacuna
 */
export function adaptVaccineToVaccinationCreateRequest(
  vaccine: VaccineFormRequest,
  petId: string,
): VaccinationCreateRequest {
  return {
    pet_id: petId,
    vaccine_name: vaccine.vaccineName,
    date_administered: vaccine.dateAdministered,
    next_due: vaccine.nextDue ?? null,
    veterinarian: vaccine.veterinarian ?? null,
    manufacturer: vaccine.manufacturer ?? null,
    lot_number: vaccine.lotNumber ?? null,
    notes: vaccine.notes ?? null,
  };
}

/**
 * Adapta datos del frontend (camelCase) a VaccinationUpdateRequest del backend (snake_case)
 * Para actualizar una vacuna
 */
export function adaptVaccineToVaccinationUpdateRequest(
  vaccine: UpdateVaccineRequest,
): VaccinationUpdateRequest {
  const request: VaccinationUpdateRequest = {};
  if (vaccine.vaccineName !== undefined)
    request.vaccine_name = vaccine.vaccineName;
  if (vaccine.dateAdministered !== undefined)
    request.date_administered = vaccine.dateAdministered;
  if (vaccine.nextDue !== undefined) request.next_due = vaccine.nextDue;
  if (vaccine.veterinarian !== undefined)
    request.veterinarian = vaccine.veterinarian;
  if (vaccine.manufacturer !== undefined)
    request.manufacturer = vaccine.manufacturer;
  if (vaccine.lotNumber !== undefined) request.lot_number = vaccine.lotNumber;
  if (vaccine.notes !== undefined) request.notes = vaccine.notes;
  if (vaccine.proofDocumentId !== undefined)
    request.proof_document_id = vaccine.proofDocumentId;
  return request;
}
