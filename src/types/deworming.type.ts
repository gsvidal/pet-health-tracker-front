// ---------- Formulario de Desparasitación ----------
// Según DewormingCreate de la API: requeridos: date_administered, pet_id
export interface DewormingFormRequest {
  medication?: string | null; // opcional, maxLength: 200
  dateAdministered: string; // requerido, format: date
  nextDue?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  notes?: string | null; // opcional
}

/**
 * Estado del formulario (valores como strings para inputs de React)
 * Se convierte a DewormingFormRequest antes de enviar
 */
export interface DewormingFormState {
  medication: string;
  dateAdministered: string;
  nextDue: string;
  veterinarian: string;
  notes: string;
}

/**
 * Para actualizar (todos los campos opcionales según DewormingUpdate)
 */
export interface UpdateDewormingRequest {
  medication?: string | null; // opcional, maxLength: 200
  dateAdministered?: string | null; // opcional, format: date
  nextDue?: string | null; // opcional, format: date
  veterinarian?: string | null; // opcional, maxLength: 200
  notes?: string | null; // opcional
}

