import { useState } from 'react';
import type { Reminder } from '../../../../../models/reminder.model';
import { useReminderForm } from '../../../../../hooks/useReminderForm';
import { useReminderCrud } from '../../../../../hooks/useReminderCrud';
import { Button } from '../../../../../components/Button/Button';
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaTrash,
  FaPlus,
} from 'react-icons/fa';
import './RemindersSection.scss';
import { useModalStore } from '../../../../../store/modal.store';

interface RemindersSectionProps {
  petId?: string | null;
  // context?: 'vaccination' | 'deworming' | 'visit';
  defaultTitle?: string;
  defaultDescription?: string;
  suggestedEventTime?: string; // Para pre-llenar fecha/hora desde nextDue
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({
  petId,
  // context = 'vaccination',
  defaultTitle = '',
  defaultDescription = '',
  suggestedEventTime,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showAllReminders, setShowAllReminders] = useState<boolean>(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const { openModal } = useModalStore();

  const {
    reminders,
    loading: crudLoading,
    error: crudError,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleActive,
  } = useReminderCrud({
    petId,
    isActive: undefined, // Mostrar todos
    autoFetch: true,
  });

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    watch,
    setValue,
  } = useReminderForm({
    editingReminder,
    onSave: async (data) => {
      const reminderData = {
        ...data,
        petId: petId || null,
      };
      if (editingReminder) {
        await updateReminder(editingReminder.id, reminderData);
      } else {
        await createReminder(reminderData);
      }
    },
    onSuccess: () => {
      setShowForm(false);
      setEditingReminder(null);
    },
    defaultTitle,
    defaultDescription,
    suggestedEventTime,
  });

  const loading = crudLoading;

  const handleAddClick = () => {
    setEditingReminder(null);
    setShowForm(true);
  };

  const handleEditClick = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleDeleteClick = (reminder: Reminder) => {
    openModal({
      title: `¿Estás seguro que quieres eliminar "${reminder.title}"?`,
      content: 'Esta acción no se puede deshacer',
      variant: 'confirm',
      onConfirm: () => {
        deleteReminder(reminder.id);
      },
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    });
  };

  const handleCancelForm = () => {
    handleCancel();
    setShowForm(false);
    setEditingReminder(null);
  };

  const handleToggleActive = (reminder: Reminder) => {
    toggleActive(reminder.id, reminder.isActive);
  };

  const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFrequencyLabel = (frequency: string): string => {
    const labels: Record<string, string> = {
      once: 'Una vez',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual',
    };
    return labels[frequency] || frequency;
  };

  // Filtrar recordatorios del pet si petId está definido
  const filteredReminders = petId
    ? reminders.filter((r) => r.petId === petId)
    : reminders;

  return (
    <div className="reminders-section">
      <div className="pet-section-card pet-section-card--reminders">
        <div className="reminders-section__header">
          <div>
            <h3>Recordatorios</h3>
            <p>Configura recordatorios para eventos médicos</p>
            <Button
              variant="secondary"
              style={{ marginTop: '20px' }}
              onClick={() =>
                setShowAllReminders((prevState: boolean) => !prevState)
              }
            >
              {showAllReminders ? 'Ocultar' : 'Mostrar'} todos los recordatorios
            </Button>
          </div>
          {!showForm && (
            <Button variant="outline" onClick={handleAddClick}>
              <FaPlus style={{ position: 'relative', left: '-4px' }} /> Nuevo
              Recordatorio
            </Button>
          )}
        </div>

        {showForm && (
          <div className="reminders-section__form-section">
            <h4>
              {editingReminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
            </h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="reminders-section__form"
            >
              <div className="reminders-section__form-grid">
                {/* Columna Izquierda */}
                <div className="reminders-section__form-column">
                  <div className="reminders-section__field">
                    <label htmlFor="title">
                      Título <span className="required">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Ej: Próxima vacuna de Rabia - Max"
                      {...register('title', {
                        required: 'El título es obligatorio',
                        minLength: {
                          value: 1,
                          message: 'El título debe tener al menos 1 carácter',
                        },
                        maxLength: {
                          value: 200,
                          message: 'El título no puede exceder 200 caracteres',
                        },
                      })}
                      className={errors.title ? 'input-error' : ''}
                    />
                    {errors.title && (
                      <span className="error-message">
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  <div className="reminders-section__field">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                      id="description"
                      rows={3}
                      placeholder="Ej: Recordatorio para aplicar vacuna de Rabia"
                      {...register('description')}
                    />
                  </div>

                  <div className="reminders-section__field">
                    <label htmlFor="eventDate">
                      Fecha <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="eventDate"
                        type="date"
                        {...register('eventDate', {
                          required: 'La fecha es obligatoria',
                        })}
                        className={errors.eventDate ? 'input-error' : ''}
                      />
                    </div>
                    {errors.eventDate && (
                      <span className="error-message">
                        {errors.eventDate.message}
                      </span>
                    )}
                  </div>

                  <div className="reminders-section__field">
                    <label htmlFor="eventHour">
                      Hora <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaClock className="input-icon" />
                      <input
                        id="eventHour"
                        type="time"
                        {...register('eventHour', {
                          required: 'La hora es obligatoria',
                        })}
                        className={errors.eventHour ? 'input-error' : ''}
                      />
                    </div>
                    {errors.eventHour && (
                      <span className="error-message">
                        {errors.eventHour.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="reminders-section__form-column">
                  <div className="reminders-section__field">
                    <label htmlFor="frequency">Frecuencia</label>
                    <select
                      id="frequency"
                      {...register('frequency')}
                      className={errors.frequency ? 'input-error' : ''}
                    >
                      <option value="once">Una vez</option>
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                      <option value="yearly">Anual</option>
                    </select>
                    {errors.frequency && (
                      <span className="error-message">
                        {errors.frequency.message}
                      </span>
                    )}
                  </div>

                  <div className="reminders-section__field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        {...register('isActive')}
                        className="checkbox-input"
                      />
                      <span>Recordatorio activo</span>
                    </label>
                  </div>

                  <div className="reminders-section__field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        {...register('notifyByEmail')}
                        className="checkbox-input"
                      />
                      <span>Notificar por email</span>
                    </label>
                  </div>

                  <div className="reminders-section__field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        {...register('notifyInApp')}
                        className="checkbox-input"
                      />
                      <span>Notificar en la app</span>
                    </label>
                  </div>
                </div>
              </div>

              {crudError && (
                <div className="server-error">
                  <p>Error: {crudError}</p>
                </div>
              )}

              <div className="reminders-section__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  variant="primary"
                >
                  {editingReminder ? 'Actualizar' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelForm}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <>
            {crudError && (
              <div className="server-error">
                <p>Error: {crudError}</p>
              </div>
            )}

            {loading && filteredReminders.length === 0 ? (
              <p className="reminders-section__loading">
                Cargando recordatorios...
              </p>
            ) : (
              filteredReminders.length === 0 && (
                <p className="reminders-section__empty">
                  No hay recordatorios configurados aún
                </p>
              )
            )}
          </>
        )}

        {showAllReminders && (
          <div className="reminders-section__list">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="reminders-section__reminder-card"
              >
                <div className="reminder-card__content">
                  <div className="reminder-card__main">
                    <div className="reminder-card__toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={reminder.isActive}
                          onChange={() => handleToggleActive(reminder)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="reminder-card__info">
                      <div className="reminder-card__datetime">
                        <FaClock className="datetime-icon" />
                        <span>{formatDateTime(reminder.eventTime)}</span>
                      </div>
                      <h4 className="reminder-card__title">{reminder.title}</h4>
                      {reminder.description && (
                        <p className="reminder-card__description">
                          {reminder.description}
                        </p>
                      )}
                      <div className="reminder-card__meta">
                        <span className="reminder-card__frequency">
                          {getFrequencyLabel(reminder.frequency)}
                        </span>
                        {reminder.notifyByEmail && (
                          <span className="reminder-card__badge">Email</span>
                        )}
                        {reminder.notifyInApp && (
                          <span className="reminder-card__badge">In-App</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="reminder-card__actions">
                    <button
                      className="reminder-card__action-btn"
                      onClick={() => handleEditClick(reminder)}
                      aria-label="Editar recordatorio"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="reminder-card__action-btn reminder-card__action-btn--delete"
                      onClick={() => handleDeleteClick(reminder)}
                      aria-label="Eliminar recordatorio"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
