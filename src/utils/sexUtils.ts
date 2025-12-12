import i18n from '../i18n/config';

/**
 * Valores estándar que el backend espera para el campo sex
 * Según la documentación: "Macho, Hembra, Otro"
 */
export const BACKEND_SEX_VALUES = {
  MALE: 'Macho',
  FEMALE: 'Hembra',
  OTHER: 'Otro',
} as const;

/**
 * Convierte un valor de sexo del backend a su label traducido para la UI
 * @param backendValue - Valor del backend ("Macho", "Hembra", "Otro")
 * @returns Label traducido para mostrar en la UI
 */
export function getSexLabel(backendValue: string | null | undefined): string {
  if (!backendValue) return '';

  const sexMap: Record<string, string> = {
    Macho: 'pet.form.sexOptions.macho',
    Hembra: 'pet.form.sexOptions.hembra',
    Otro: 'pet.form.sexOptions.other',
    // También manejar valores en minúscula por compatibilidad
    macho: 'pet.form.sexOptions.macho',
    hembra: 'pet.form.sexOptions.hembra',
    otro: 'pet.form.sexOptions.other',
  };

  const translationKey = sexMap[backendValue];
  if (translationKey) {
    return i18n.t(translationKey);
  }

  return backendValue; // Fallback al valor original
}

/**
 * Normaliza un valor de sexo a formato backend (mayúscula inicial)
 * @param value - Valor de sexo (puede estar en cualquier formato)
 * @returns Valor normalizado para el backend
 */
export function normalizeSexValue(value: string | null | undefined): string | null {
  if (!value) return null;

  const normalized = value.toLowerCase();
  const sexMap: Record<string, string> = {
    macho: BACKEND_SEX_VALUES.MALE,
    hembra: BACKEND_SEX_VALUES.FEMALE,
    otro: BACKEND_SEX_VALUES.OTHER,
    male: BACKEND_SEX_VALUES.MALE,
    female: BACKEND_SEX_VALUES.FEMALE,
    other: BACKEND_SEX_VALUES.OTHER,
  };

  return sexMap[normalized] || value; // Si no está en el mapa, devolver el valor original
}

