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

