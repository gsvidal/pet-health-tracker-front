/**
 * Formatea una fecha ISO string a formato "Mes Año" en español
 * @param dateString - Fecha en formato ISO string (ej: "2024-01-15T00:00:00.000Z")
 * @returns String formateado (ej: "Enero 2024")
 */
export const formatDateToSpanishMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Parsea una fecha ISO string a fecha local sin cambios de timezone
 * Si la fecha viene como "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm:ssZ",
 * la parsea correctamente en la zona horaria local
 * @param dateString - Fecha en formato ISO string o date string
 * @returns Date object en zona horaria local
 */
export const parseDateLocal = (dateString: string): Date => {
  // Si es solo fecha (YYYY-MM-DD), crear Date en zona local a mediodía
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0); // Mediodía local
  }

  // Si tiene hora, parsear normalmente
  const date = new Date(dateString);
  return date;
};

/**
 * Formatea una fecha a string legible en español (solo fecha)
 * Evita cambios de timezone usando parseDateLocal
 * @param dateString - Fecha en formato ISO string o date string
 * @returns String formateado (ej: "15 de enero de 2025")
 */
export const formatDateLocal = (dateString: string): string => {
  const date = parseDateLocal(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha con hora a string legible en español
 * @param dateString - Fecha en formato ISO string
 * @returns String formateado (ej: "15 de enero de 2025, 14:30")
 */
export const formatDateTimeLocal = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Convierte una fecha local (YYYY-MM-DD) y hora (HH:mm) a ISO string
 * Usa mediodía local para evitar cambios de día por timezone
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @param timeString - Hora en formato HH:mm (opcional, default: "12:00")
 * @returns ISO string en UTC
 */
export const combineDateAndTimeToISO = (
  dateString: string,
  timeString: string = '12:00',
): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  // Crear fecha en zona local
  const localDate = new Date(year, month - 1, day, hours, minutes, 0);

  // Convertir a ISO string (UTC)
  return localDate.toISOString();
};
