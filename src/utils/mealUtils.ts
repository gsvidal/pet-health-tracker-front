import i18n from '../i18n/config';

/**
 * Mapeo de valores de tipo de comida del backend a claves de traducción
 */
const MEAL_TYPE_MAP: Record<string, string> = {
  // Español (valores que vienen del backend)
  Desayuno: 'nutrition.breakfast',
  Almuerzo: 'nutrition.lunch',
  Cena: 'nutrition.dinner',
  Snack: 'nutrition.snack',
  // Inglés (por si acaso)
  Breakfast: 'nutrition.breakfast',
  Lunch: 'nutrition.lunch',
  Dinner: 'nutrition.dinner',
};

/**
 * Parsea la descripción de una comida y extrae el tipo de comida
 * Formato esperado: "Desayuno - Croquetas (200g) | Notas" o "Desayuno - Croquetas"
 * @param description - Descripción completa de la comida
 * @returns Tipo de comida traducido o null
 */
export function parseMealType(description: string | null | undefined): string | null {
  if (!description) return null;

  // Buscar el tipo de comida al inicio de la descripción
  // Puede estar seguido de " - " o ser solo el tipo
  for (const [backendValue, translationKey] of Object.entries(MEAL_TYPE_MAP)) {
    if (description.startsWith(backendValue)) {
      // Verificar que está seguido de " - " o es el final de la descripción
      const rest = description.substring(backendValue.length).trim();
      if (rest === '' || rest.startsWith(' - ') || rest.startsWith(' | ')) {
        return i18n.t(translationKey);
      }
    }
  }

  return null;
}

/**
 * Parsea la descripción de una comida y extrae solo el nombre de la comida (sin tipo)
 * Formato esperado: "Desayuno - Croquetas (200g) | Notas" o "Desayuno - Croquetas"
 * @param description - Descripción completa de la comida
 * @returns Nombre de la comida sin el tipo, o la descripción completa si no se puede parsear
 */
export function parseMealName(description: string | null | undefined): string {
  if (!description) return '';

  // Buscar el tipo de comida al inicio
  for (const backendValue of Object.keys(MEAL_TYPE_MAP)) {
    if (description.startsWith(backendValue)) {
      // Remover el tipo y el separador " - " si existe
      let withoutType = description
        .replace(new RegExp(`^${backendValue}\\s*-\\s*`), '')
        .trim();

      // Si no había separador, el tipo era todo el contenido
      if (withoutType === description) {
        // El tipo era todo, devolver vacío o el tipo traducido
        return '';
      }

      // Si hay notas (después de " | "), removerlas también
      const withoutNotes = withoutType.split(' | ')[0].trim();

      // Remover cantidad entre paréntesis si existe
      const withoutQuantity = withoutNotes.replace(/\s*\([^)]*\)\s*$/, '').trim();

      return withoutQuantity || description;
    }
  }

  // Si no se puede parsear, devolver la descripción completa
  return description;
}

/**
 * Obtiene el valor del backend para el tipo de comida basado en la traducción actual
 * @param translatedLabel - Label traducido (ej: "Breakfast" o "Desayuno")
 * @returns Valor del backend (ej: "Desayuno")
 */
export function getBackendMealTypeValue(translatedLabel: string): string {
  const currentLang = i18n.language;

  // Si estamos en español, los valores ya están en español
  if (currentLang === 'es') {
    return translatedLabel;
  }

  // Si estamos en inglés, necesitamos convertir a español para el backend
  const englishToSpanish: Record<string, string> = {
    Breakfast: 'Desayuno',
    Lunch: 'Almuerzo',
    Dinner: 'Cena',
    Snack: 'Snack',
  };

  return englishToSpanish[translatedLabel] || translatedLabel;
}

/**
 * Obtiene el label traducido para mostrar en la UI basado en el valor del backend
 * @param backendValue - Valor del backend (ej: "Desayuno")
 * @returns Label traducido para la UI
 */
export function getMealTypeLabel(backendValue: string): string {
  const translationKey = MEAL_TYPE_MAP[backendValue];
  if (translationKey) {
    return i18n.t(translationKey);
  }
  return backendValue; // Fallback al valor original si no hay traducción
}

