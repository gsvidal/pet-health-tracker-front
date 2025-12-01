// ---------- Formulario de Contacto ----------
export interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  acceptTerms: boolean;
}

export interface ContactFormResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'read' | 'replied';
}

// Para actualizar (todos los campos opcionales excepto id)
export interface UpdateContactFormRequest {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  acceptTerms?: boolean;
}


