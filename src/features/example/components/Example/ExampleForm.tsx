import './ExampleForm.scss';
import { useExampleForm } from '../../hooks/useExampleForm';
import { useExampleCrud } from '../../hooks/useExampleCrud';

import {
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaComment,
  FaCheck,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
import { Button } from '../../../../components/Button/Button';

export const ExampleForm = () => {
  // Hook del formulario (CREATE)
  const {
    register,
    handleSubmit,
    errors,
    isDirty,
    isValid,
    touchedFields,
    loading: formLoading,
    serverError: formError,
    watchedEmail,
    fillExampleData,
    onSubmit,
  } = useExampleForm();

  // Hook de CRUD (READ, UPDATE, DELETE)
  const {
    submissions,
    loading: crudLoading,
    error: crudError,
    updateSubmission,
    deleteSubmission,
    handleSelectSubmission,
  } = useExampleCrud();

  const loading = formLoading || crudLoading;

  return (
    <div className="example-form">
      <div className="example-form__container">
        <div className="example-form__header">
          <h2>Formulario de Contacto - React Hook Form</h2>
          <p>Ejemplo completo con validaciones, watch, y operaciones CRUD</p>
        </div>

        {/* Debug Info */}
        <div className="example-form__debug">
          <div className="debug-item">
            <span>Form Dirty:</span>
            <span className={isDirty ? 'true' : 'false'}>
              {isDirty ? '✓' : '✗'}
            </span>
          </div>
          <div className="debug-item">
            <span>Form Valid:</span>
            <span className={isValid ? 'true' : 'false'}>
              {isValid ? '✓' : '✗'}
            </span>
          </div>
          <div className="debug-item">
            <span>Email Watched:</span>
            <span>{watchedEmail || '(vacío)'}</span>
          </div>
        </div>

        {/* Formulario de creación */}
        <form onSubmit={handleSubmit(onSubmit)} className="example-form__form">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="name">
              <FaUser /> Nombre <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              {...register('name', {
                required: 'El nombre es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
                maxLength: {
                  value: 50,
                  message: 'El nombre no puede exceder 50 caracteres',
                },
              })}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
            {touchedFields.name && !errors.name && (
              <span className="success-message">✓ Campo válido</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido',
                },
              })}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
            {touchedFields.email && !errors.email && (
              <span className="success-message">✓ Email válido</span>
            )}
          </div>

          {/* Asunto */}
          <div className="form-group">
            <label htmlFor="subject">
              <FaFileAlt /> Asunto <span className="required">*</span>
            </label>
            <input
              id="subject"
              type="text"
              placeholder="¿Sobre qué quieres contactarnos?"
              {...register('subject', {
                required: 'El asunto es obligatorio',
                minLength: {
                  value: 5,
                  message: 'El asunto debe tener al menos 5 caracteres',
                },
              })}
              className={errors.subject ? 'error' : ''}
            />
            {errors.subject && (
              <span className="error-message">{errors.subject.message}</span>
            )}
          </div>

          {/* Mensaje */}
          <div className="form-group">
            <label htmlFor="message">
              <FaComment /> Mensaje <span className="required">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
              {...register('message', {
                required: 'El mensaje es obligatorio',
                minLength: {
                  value: 10,
                  message: 'El mensaje debe tener al menos 10 caracteres',
                },
                maxLength: {
                  value: 500,
                  message: 'El mensaje no puede exceder 500 caracteres',
                },
              })}
              className={errors.message ? 'error' : ''}
            />
            {errors.message && (
              <span className="error-message">{errors.message.message}</span>
            )}
          </div>

          {/* Checkbox Términos */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('acceptTerms', {
                  required: 'Debes aceptar los términos y condiciones',
                })}
                className={errors.acceptTerms ? 'error' : ''}
              />
              <span>
                <FaCheck /> Acepto los términos y condiciones{' '}
                <span className="required">*</span>
              </span>
            </label>
            {errors.acceptTerms && (
              <span className="error-message">
                {errors.acceptTerms.message}
              </span>
            )}
          </div>

          {/* Errores */}
          {formError && (
            <div className="server-error">
              <p>Error: {formError}</p>
            </div>
          )}

          {/* Botones del formulario */}
          <div className="form-actions">
            <Button
              type="submit"
              disabled={loading || !isValid}
              fullWidth
              variant="primary"
            >
              {loading ? 'Enviando...' : 'Enviar Formulario'}
            </Button>
            <Button
              type="button"
              onClick={fillExampleData}
              variant="secondary"
              fullWidth
            >
              Llenar Datos de Ejemplo
            </Button>
          </div>
        </form>

        {/* Lista de submissions (CRUD) */}
        <div className="example-form__list">
          <h3>Formularios Enviados ({submissions.length})</h3>
          {crudError && (
            <div className="server-error">
              <p>Error: {crudError}</p>
            </div>
          )}
          {submissions.length === 0 ? (
            <p className="empty-message">No hay formularios enviados aún</p>
          ) : (
            <div className="submissions-grid">
              {submissions.map((submission) => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <h4>{submission.name}</h4>
                    <span className={`status status-${submission.status}`}>
                      {submission.status}
                    </span>
                  </div>
                  <p className="submission-email">{submission.email}</p>
                  <p className="submission-subject">{submission.subject}</p>
                  <p className="submission-message">{submission.message}</p>
                  <div className="submission-actions">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        updateSubmission(submission.id, {
                          subject: `${submission.subject} (actualizado)`,
                        })
                      }
                    >
                      <FaEdit /> Actualizar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSubmission(submission.id)}
                    >
                      <FaTrash /> Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


