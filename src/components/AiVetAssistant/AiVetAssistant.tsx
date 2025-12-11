import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import {
  askVeterinaryQuestion,
  type ChatMessage,
} from '../../services/chat.service';
import { usePetStore } from '../../store/pet.store';
import { useAuthStore } from '../../store/auth.store';
import { renderFormattedText } from '../../utils/chatFormatting';
import { formatPetAge } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './AiVetAssistant.scss';

export const AiVetAssistant = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { pets, documents, fetchPetDocuments } = usePetStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extraer el petId directamente del pathname
  // La ruta es /pets/{petId} o /pets/{petId}/...
  const extractPetIdFromPath = (pathname: string): string | null => {
    const match = pathname.match(/^\/pets\/([^/]+)/);
    if (match && match[1] && match[1] !== 'create') {
      return match[1];
    }
    return null;
  };

  // Detectar si estamos en la página de detalle de una mascota
  const petIdFromPath = extractPetIdFromPath(location.pathname);
  const isPetDetailPage = !!petIdFromPath;

  // Determinar el petId a usar: solo si estamos en página de detalle
  const petId = isPetDetailPage ? petIdFromPath : null;
  const currentPet = petId ? pets.find((p) => p.id === petId) : null;

  // Cargar documentos cuando estamos en la página de detalle y cambia el petId
  useEffect(() => {
    if (isPetDetailPage && petId) {
      fetchPetDocuments(petId);
    }
  }, [isPetDetailPage, petId, fetchPetDocuments]);

  // Resetear sessionId y mensajes cuando cambia el petId
  useEffect(() => {
    if (petId && user?.id) {
      const newSessionId = `${user.id}_${petId}`;
      if (sessionId !== newSessionId) {
        setSessionId(newSessionId);
        setMessages([]);
      }
    } else {
      setSessionId(null);
      setMessages([]);
    }
  }, [petId, user?.id, sessionId]);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    // Validar que tengamos petId y texto
    if (!petId || !inputValue.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askVeterinaryQuestion(
        petId,
        userMessage.content,
        sessionId,
      );

      if (response.error) {
        toast.error(response.error || 'Error al obtener respuesta');
        setMessages((prev) => prev.slice(0, -1)); // Remover el mensaje del usuario si hay error
        return;
      }

      // Actualizar sessionId si viene en la respuesta
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Agregar la respuesta del asistente
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar mensaje. Por favor intenta de nuevo.');
      setMessages((prev) => prev.slice(0, -1)); // Remover el mensaje del usuario si hay error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  // No mostrar el chatbot si el usuario no está autenticado o no está en página de detalle
  if (!isAuthenticated || !isPetDetailPage || !petId) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        className="ai-vet-assistant__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat con veterinario"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <span className="ai-vet-assistant__toggle-text">Habla conmigo</span>
        )}
      </button>

      {/* Chat box */}
      {isOpen && (
        <div className="ai-vet-assistant__chat-box">
          <div className="ai-vet-assistant__header">
            <div className="ai-vet-assistant__header-info">
              <h3>Veterinario IA</h3>
              {currentPet && (
                <p className="ai-vet-assistant__pet-name">
                  Consultando sobre: {currentPet.name}
                  {documents.length > 0 && (
                    <span className="ai-vet-assistant__documents-badge">
                      {' '}
                      • {documents.length} documento
                      {documents.length > 1 ? 's' : ''} disponible
                      {documents.length > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              )}
            </div>
            <button
              className="ai-vet-assistant__close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              <X size={17} />
            </button>
          </div>

          <div className="ai-vet-assistant__messages">
            {messages.length === 0 ? (
              <div className="ai-vet-assistant__empty">
                <MessageCircle
                  size={48}
                  className="ai-vet-assistant__empty-icon"
                />
                {currentPet ? (
                  <>
                    <p>¡Hola! Soy tu asistente veterinario con IA.</p>
                    <p>
                      Puedes preguntarme sobre la salud de{' '}
                      <strong>{currentPet.name}</strong>
                      {currentPet.species && (
                        <>, tu {currentPet.species.toLowerCase()}</>
                      )}
                      {currentPet.ageYears !== null &&
                        currentPet.ageYears !== undefined && (
                          <> de {formatPetAge(currentPet.ageYears)}</>
                        )}
                      .
                    </p>
                    {documents.length > 0 ? (
                      <p className="ai-vet-assistant__documents-info">
                        📄 Tengo acceso a {documents.length} documento
                        {documents.length > 1 ? 's' : ''} de {currentPet.name}{' '}
                        para darte respuestas más precisas.
                      </p>
                    ) : (
                      <p className="ai-vet-assistant__documents-info">
                        💡 Puedo ayudarte con información general sobre{' '}
                        {currentPet.name}. Si subes documentos PDF
                        (vacunaciones, visitas veterinarias, etc.), podré darte
                        respuestas más precisas.
                      </p>
                    )}
                    <p className="ai-vet-assistant__examples">
                      Ejemplos: "¿Cuándo fue la última vacunación de{' '}
                      {currentPet.name}?", "{currentPet.name} tiene fiebre, ¿qué
                      hago?", "¿Qué cuidados necesita {currentPet.name}?"
                    </p>
                  </>
                ) : (
                  <p>Cargando información de la mascota...</p>
                )}
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`ai-vet-assistant__message ai-vet-assistant__message--${message.role}`}
                  >
                    <div className="ai-vet-assistant__message-content">
                      {message.role === 'assistant'
                        ? renderFormattedText(message.content)
                        : message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="ai-vet-assistant__message ai-vet-assistant__message--assistant">
                    <div className="ai-vet-assistant__message-content">
                      <Loader2 size={16} className="ai-vet-assistant__loader" />
                      <span>Pensando...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="ai-vet-assistant__input-container">
            <input
              ref={inputRef}
              type="text"
              className="ai-vet-assistant__input"
              placeholder={
                currentPet
                  ? `Pregunta sobre ${currentPet.name}...`
                  : 'Escribe tu pregunta...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !petId}
            />
            <button
              className="ai-vet-assistant__send"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !petId}
              aria-label="Enviar mensaje"
            >
              {isLoading ? (
                <Loader2 size={18} className="ai-vet-assistant__send-loader" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>

          {messages.length > 0 && (
            <button
              className="ai-vet-assistant__clear"
              onClick={handleClearChat}
              type="button"
            >
              Limpiar conversación
            </button>
          )}
        </div>
      )}
    </>
  );
};
