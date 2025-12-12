import i18n from '../i18n/config';

/**
 * Traduce un código de estado de salud a su etiqueta según el idioma actual
 * @param status - Código interno del estado de salud ('healthy', 'attention_required', 'review_needed')
 * @returns Etiqueta traducida según el idioma actual
 */
export function translateHealthStatus(status: string): string {
  const statusMap: Record<string, string> = {
    healthy: 'pet.healthStatus.healthy',
    attention_required: 'pet.healthStatus.attentionRequired',
    review_needed: 'pet.healthStatus.reviewNeeded',
  };

  const translationKey = statusMap[status];
  if (!translationKey) {
    return status; // Fallback al código si no existe
  }

  return i18n.t(translationKey);
}
