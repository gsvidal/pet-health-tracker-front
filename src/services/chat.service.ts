import { apiClient } from './api.config';

export interface ChatQuestionRequest {
  question: string;
  session_id?: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  session_id?: string | null;
  chat_history: ChatMessage[];
  has_documents: boolean;
  source_documents: unknown[];
  memory_info?: {
    current_messages?: number;
    interactions_count?: number;
    max_interactions?: number;
    max_messages?: number;
  } | null;
  error?: string | null;
}

/**
 * Hace una pregunta al veterinario experto con IA
 */
export const askVeterinaryQuestion = async (
  petId: string,
  question: string,
  sessionId?: string | null,
): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>(
    `/chat/pets/${petId}/ask`,
    {
      question,
      session_id: sessionId || null,
    },
  );

  return response.data;
};

/**
 * Limpia el historial de una conversación
 */
export const clearConversation = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`/chat/sessions/${sessionId}`);
};
