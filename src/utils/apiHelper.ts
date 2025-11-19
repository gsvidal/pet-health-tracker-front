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
    let message = 'Error desconocido';
    if (err && typeof err === 'object') {
      const axiosError = err as {
        response?: {
          data?: { message?: string; detail?: string };
        };
        message?: string;
      };
      // Mensaje definido en el back
      if (axiosError.response?.data?.message) {
        message = axiosError.response.data.message;
      }
      // Detalle del mensaje
      else if (axiosError.response?.data?.detail) {
        message = axiosError.response.data.detail;
      }
      // Mensaje genérico
      else if (axiosError.message) {
        message = axiosError.message;
      }
    }
    return { data: null, error: message };
  }
}
