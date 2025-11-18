/**
 * Helper function para llamadas a API
 * Retorna { data, error } sin manejar estados reactivos
 * Los estados (loading, error) se manejan en los stores de Zustand
 */
export async function callApi<T>(
  promiseFn: () => Promise<T>,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await promiseFn();
    return { data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return { data: null, error: errorMessage };
  }
}
