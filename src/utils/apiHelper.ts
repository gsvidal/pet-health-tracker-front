import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://pet-healthcare-back.onrender.com',
});

interface BackendError {
  message?: string;
  detail?: string;
}
export async function callApi<T, D = unknown>({
  url,
  method = 'GET',
  data,
  headers = {},
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: D;
  headers?: Record<string, string>;
}): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await api.request<T>({
      url,
      method,
      data,
      headers,
    });

    return { data: response.data, error: null };
  } catch (err) {
    let message = 'Error desconocido';

    const axiosError = err as AxiosError<BackendError>;

    if (axiosError.response?.data?.message) {
      message = axiosError.response.data.message;
    } else if (axiosError.response?.data?.detail) {
      message = axiosError.response.data.detail;
    } else if (axiosError.message) {
      message = axiosError.message;
    }

    return { data: null, error: message };
  }
}
