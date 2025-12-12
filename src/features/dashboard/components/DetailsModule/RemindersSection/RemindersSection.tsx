import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import type { Reminder } from '../../../../../models/reminder.model';
import { useReminderForm } from '../../../../../hooks/useReminderForm';
import { useReminderCrud } from '../../../../../hooks/useReminderCrud';
import { Button } from '../../../../../components/Button/Button';
import { Loader } from '../../../../../components/Loader/Loader';
import { Select } from '../../../../../components/Select';
import i18n from '../../../../../i18n/config';
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
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [showAllReminders, setShowAllReminders] = useState<boolean>(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const { openModal } = useModalStore();

  const {
    reminders,
    loading: crudLoading,
    error: crudError,
    isCreating,
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
    isSubmitting,
    control,
    // watch,
    // setValue,
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
      title: `${t('modals.delete.title')} "${reminder.title}"?`,
      content: t('modals.delete.content'),
      variant: 'confirm',
      onConfirm: () => {
        deleteReminder(reminder.id);
      },
      confirmLabel: t('common.delete'),
      cancelLabel: t('common.cancel'),
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
    const locale = i18n.language === 'en' ? 'en-US' : 'es-ES';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFrequencyLabel = (frequency: string): string => {
    const frequencyKey = `reminders.${frequency}`;
    return t(frequencyKey) || frequency;
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
            <h3>{t('reminders.title')}</h3>
            <p>{t('reminders.subtitle')}</p>
            {filteredReminders.length > 0 && (
              <Button
                variant="secondary"
                style={{
                  marginTop: '20px',
                  backgroundColor: showAllReminders
                    ? '#6b728052'
                    : 'transparent',
                }}
                onClick={() =>
                  setShowAllReminders((prevState: boolean) => !prevState)
                }
              >
                {showAllReminders
                  ? t('reminders.hideAll')
                  : t('reminders.showAll')}
              </Button>
            )}
          </div>
          {!showForm && (
            <Button variant="outline" onClick={handleAddClick}>
              <FaPlus style={{ position: 'relative', left: '-4px' }} />{' '}
              {t('reminders.add')}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="reminders-section__form-section">
            <h4>
              {editingReminder
                ? t('reminders.edit')
                : t('reminders.registerNew')}
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
                      {t('reminders.name')} <span className="required">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder={t('reminders.namePlaceholder')}
                      {...register('title', {
                        required: t('reminders.nameRequired'),
                        minLength: {
                          value: 1,
                          message: t('reminders.nameMinLength'),
                        },
                        maxLength: {
                          value: 200,
                          message: t('reminders.nameMaxLength'),
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
                    <label htmlFor="description">
                      {t('reminders.description')}
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      placeholder={t('reminders.descriptionPlaceholder')}
                      {...register('description')}
                    />
                  </div>

                  <div className="reminders-section__field">
                    <label htmlFor="eventDate">
                      {t('reminders.eventDate')}{' '}
                      <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="eventDate"
                        type="date"
                        {...register('eventDate', {
                          required: t('reminders.eventDateRequired'),
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
                      {t('reminders.eventHour')}{' '}
                      <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaClock className="input-icon" />
                      <input
                        id="eventHour"
                        type="time"
                        {...register('eventHour', {
                          required: t('reminders.eventHourRequired'),
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
                    <Controller
                      name="frequency"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            label={t('reminders.frequency')}
                            value={field.value || null}
                            onChange={(value) =>
                              field.onChange(value || 'once')
                            }
                            options={[
                              { value: 'once', label: t('reminders.once') },
                              { value: 'daily', label: t('reminders.daily') },
                              { value: 'weekly', label: t('reminders.weekly') },
                              {
                                value: 'monthly',
                                label: t('reminders.monthly'),
                              },
                              { value: 'yearly', label: t('reminders.yearly') },
                            ]}
                            placeholder={t('reminders.frequencyPlaceholder')}
                          />
                          {errors.frequency && (
                            <span className="error-message">
                              {errors.frequency.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="reminders-section__field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        {...register('isActive')}
                        className="checkbox-input"
                      />
                      <span>{t('reminders.isActive')}</span>
                    </label>
                  </div>

                  <div className="reminders-section__field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        {...register('notifyByEmail')}
                        className="checkbox-input"
                      />
                      <span>{t('reminders.notifyByEmail')}</span>
                    </label>
                  </div>

                  <div className="reminders-section__field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        {...register('notifyInApp')}
                        className="checkbox-input"
                      />
                      <span>{t('reminders.notifyInApp')}</span>
                    </label>
                  </div>
                </div>
              </div>

              {crudError && (
                <div className="server-error">
                  <p>
                    {t('common.error')}: {crudError}
                  </p>
                </div>
              )}

              <div className="reminders-section__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid || isSubmitting || isCreating}
                  variant="primary"
                >
                  {isSubmitting
                    ? t('reminders.saving')
                    : editingReminder
                      ? t('reminders.update')
                      : t('reminders.save')}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelForm}
                  variant="outline"
                >
                  {t('common.cancel')}
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
              <Loader text={t('reminders.loading')} />
            ) : (
              filteredReminders.length === 0 && (
                <p className="reminders-section__empty">
                  {t('reminders.empty')}
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
                      aria-label={t('common.edit')}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="reminder-card__action-btn reminder-card__action-btn--delete"
                      onClick={() => handleDeleteClick(reminder)}
                      aria-label={t('common.delete')}
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
