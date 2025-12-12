import i18n from '../i18n/config';

/**
 * Mapeo de valores de especie del backend a claves de traducción
 */
const SPECIES_MAP: Record<string, string> = {
  perro: 'pet.form.speciesOptions.perro',
  gato: 'pet.form.speciesOptions.gato',
  ave: 'pet.form.speciesOptions.ave',
  conejo: 'pet.form.speciesOptions.conejo',
  hamster: 'pet.form.speciesOptions.hamster',
  otro: 'pet.form.speciesOptions.otro',
};

/**
 * Convierte un valor de especie del backend a su label traducido para la UI
 * @param backendValue - Valor del backend (ej: "perro", "gato", etc.)
 * @returns Label traducido para mostrar en la UI
 */
export function getSpeciesLabel(backendValue: string | null | undefined): string {
  if (!backendValue) return '';

  const normalizedValue = backendValue.toLowerCase().trim();
  const translationKey = SPECIES_MAP[normalizedValue];

  if (translationKey) {
    return i18n.t(translationKey);
  }

  // Si no hay traducción, devolver el valor original (puede ser un valor personalizado)
  return backendValue;
}

