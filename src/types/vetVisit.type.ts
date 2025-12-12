// ---------- Formulario de Visita Veterinaria ----------
// Según VetVisitCreate de la API: requeridos: visit_date, pet_id
export interface VetVisitFormRequest {
  visitDate: string; // requerido, format: date-time
  reason?: string | null; // opcional
  diagnosis?: string | null; // opcional
  treatment?: string | null; // opcional
  followUpDate?: string | null; // opcional, format: date-time
  veterinarian?: string | null; // opcional, maxLength: 200
  documentsId?: string | null; // opcional
}

/**
 * Estado del formulario (valores como strings para inputs de React)
 * Se convierte a VetVisitFormRequest antes de enviar
 */
export interface VetVisitFormState {
  visitDate: string; // Solo fecha (YYYY-MM-DD)
  visitHour: string; // Solo hora (HH:mm)
  reason: string;
  diagnosis: string;
  treatment: string;
  followUpDate: string; // Solo fecha (YYYY-MM-DD)
  followUpHour: string; // Solo hora (HH:mm)
  veterinarian: string;
}

/**
 * Para actualizar (todos los campos opcionales según VetVisitUpdate)
 */
export interface UpdateVetVisitRequest {
  visitDate?: string | null; // opcional, format: date-time
  reason?: string | null; // opcional
  diagnosis?: string | null; // opcional
  treatment?: string | null; // opcional
  followUpDate?: string | null; // opcional, format: date-time
  veterinarian?: string | null; // opcional, maxLength: 200
  documentsId?: string | null; // opcional
}
