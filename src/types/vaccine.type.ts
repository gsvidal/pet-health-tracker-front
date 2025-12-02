// ---------- Formulario de Vacuna ----------
// Según VaccinationCreate de la API: requeridos: vaccine_name, date_administered, pet_id
export interface VaccineFormRequest {
  vaccineName: string; // requerido, minLength: 1, maxLength: 200
  dateAdministered: string; // requerido, format: date
  nextDue?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  manufacturer?: string | null; // opcional, maxLength: 200
  lotNumber?: string | null; // opcional, maxLength: 100
  notes?: string | null; // opcional
}

/**
 * Estado del formulario (valores como strings para inputs de React)
 * Se convierte a VaccineFormRequest antes de enviar
 */
export interface VaccineFormState {
  vaccineName: string;
  dateAdministered: string;
  nextDue: string;
  veterinarian: string;
  manufacturer: string;
  lotNumber: string;
  notes: string;
}

/**
 * Para actualizar (todos los campos opcionales según VaccinationUpdate)
 */
export interface UpdateVaccineRequest {
  vaccineName?: string | null; // opcional, minLength: 1, maxLength: 200
  dateAdministered?: string | null; // opcional, format: date
  nextDue?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  manufacturer?: string | null; // opcional, maxLength: 200
  lotNumber?: string | null; // opcional, maxLength: 100
  notes?: string | null; // opcional
  proofDocumentId?: string | null; // opcional
}
