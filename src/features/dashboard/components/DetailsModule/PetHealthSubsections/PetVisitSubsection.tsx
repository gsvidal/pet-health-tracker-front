import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../../../../../models/pet.model';
import type { VetVisit } from '../../../../../models/vetVisit.model';
import { useVetVisitForm } from '../../../../../hooks/useVetVisitForm';
import { useVetVisitCrud } from '../../../../../hooks/useVetVisitCrud';
import { Button } from '../../../../../components/Button/Button';
import { RemindersSection } from '../RemindersSection/RemindersSection';
import { useModalStore } from '../../../../../store/modal.store';
import { Loader } from '../../../../../components/Loader/Loader';
import { formatDateTimeLocal } from '../../../../../utils/dateUtils';
import {
  FaStethoscope,
  FaCalendarAlt,
  FaUserMd,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaClock,
} from 'react-icons/fa';
import './PetVisitSubsection.scss';

interface PetVisitSubsectionProps {
  pet: Pet;
}

export const PetVisitSubsection: React.FC<PetVisitSubsectionProps> = ({
  pet,
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingVetVisit, setEditingVetVisit] = useState<VetVisit | null>(null);
  const { openModal } = useModalStore();

  const {
    vetVisits,
    loading: crudLoading,
    error: crudError,
    createVetVisit,
    updateVetVisit,
    deleteVetVisit,
  } = useVetVisitCrud({ petId: pet.id || '' });

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    watch,
  } = useVetVisitForm({
    editingVetVisit,
    onSave: async (data) => {
      if (editingVetVisit) {
        await updateVetVisit(editingVetVisit.id, data);
      } else {
        await createVetVisit(data);
      }
    },
    onSuccess: () => {
      setShowForm(false);
      setEditingVetVisit(null);
    },
  });

  const loading = crudLoading;

  const handleAddClick = () => {
    setEditingVetVisit(null);
    setShowForm(true);
  };

  const handleEditClick = (vetVisit: VetVisit) => {
    setEditingVetVisit(vetVisit);
    setShowForm(true);
  };

  const handleDeleteClick = (vetVisit: VetVisit) => {
    const reasonText = vetVisit.reason || t('common.thisItem');
    openModal({
      title: `${t('modals.delete.title')} "${reasonText}"?`,
      content: t('modals.delete.content'),
      variant: 'confirm',
      onConfirm: () => {
        deleteVetVisit(vetVisit.id);
      },
      confirmLabel: t('common.delete'),
      cancelLabel: t('common.cancel'),
    });
  };

  const handleCancelForm = () => {
    handleCancel();
    setShowForm(false);
    setEditingVetVisit(null);
  };

  const visitDateValue = watch('visitDate');

  return (
    <div className="visit-subsection">
      {/* Sección 1: Registro de Visita Veterinaria */}
      <div className="pet-section-card pet-section-card--visit">
        <div className="visit-subsection__header">
          <div>
            <h3>{t('health.visit.title')}</h3>
            <p>{t('health.visit.manageHistory', { petName: pet.name })}</p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              onClick={handleAddClick}
              style={{ fontSize: '1.2rem' }}
            >
              <FaPlus style={{ position: 'relative', left: '-4px' }} />{' '}
              {t('health.visit.add')}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="visit-subsection__form-section">
            <h4>
              {editingVetVisit
                ? t('health.visit.edit')
                : t('health.visit.registerNew')}
            </h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="visit-subsection__form"
            >
              <div className="visit-subsection__form-grid">
                {/* Columna Izquierda */}
                <div className="visit-subsection__form-column">
                  <div className="visit-subsection__field">
                    <label htmlFor="visitDate">
                      {t('health.visit.visitDate')}{' '}
                      <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="visitDate"
                        type="date"
                        {...register('visitDate', {
                          required: t('health.visit.visitDateRequired'),
                        })}
                        className={errors.visitDate ? 'input-error' : ''}
                      />
                    </div>
                    {errors.visitDate && (
                      <span className="error-message">
                        {errors.visitDate.message}
                      </span>
                    )}
                  </div>

                  <div className="visit-subsection__field">
                    <label htmlFor="visitHour">
                      {t('health.visit.visitHour')}{' '}
                      <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaClock className="input-icon" />
                      <input
                        id="visitHour"
                        type="time"
                        {...register('visitHour', {
                          required: t('health.visit.visitHourRequired'),
                        })}
                        className={errors.visitHour ? 'input-error' : ''}
                      />
                    </div>
                    {errors.visitHour && (
                      <span className="error-message">
                        {errors.visitHour.message}
                      </span>
                    )}
                  </div>

                  <div className="visit-subsection__field">
                    <label htmlFor="reason">{t('health.visit.reason')}</label>
                    <input
                      id="reason"
                      type="text"
                      placeholder={t('health.visit.reasonPlaceholder')}
                      {...register('reason')}
                      className={errors.reason ? 'input-error' : ''}
                    />
                    {errors.reason && (
                      <span className="error-message">
                        {errors.reason.message}
                      </span>
                    )}
                  </div>

                  <div className="visit-subsection__field">
                    <label htmlFor="diagnosis">
                      {t('health.visit.diagnosis')}
                    </label>
                    <div className="input-with-icon">
                      <FaFileAlt className="input-icon" />
                      <textarea
                        id="diagnosis"
                        rows={4}
                        placeholder={t('health.visit.diagnosisPlaceholder')}
                        {...register('diagnosis')}
                      />
                    </div>
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="visit-subsection__form-column">
                  <div className="visit-subsection__field">
                    <label htmlFor="treatment">
                      {t('health.visit.treatment')}
                    </label>
                    <div className="input-with-icon">
                      <FaFileAlt className="input-icon" />
                      <textarea
                        id="treatment"
                        rows={4}
                        placeholder={t('health.visit.treatmentPlaceholder')}
                        {...register('treatment')}
                      />
                    </div>
                  </div>

                  <div className="visit-subsection__field">
                    <label htmlFor="followUpDate">
                      {t('health.visit.followUpDate')}
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="followUpDate"
                        type="date"
                        {...register('followUpDate', {
                          validate: (value) => {
                            if (!value) return true; // Opcional
                            if (visitDateValue && value <= visitDateValue) {
                              return t('health.visit.followUpAfter');
                            }
                            return true;
                          },
                        })}
                        className={errors.followUpDate ? 'input-error' : ''}
                      />
                    </div>
                    {errors.followUpDate && (
                      <span className="error-message">
                        {errors.followUpDate.message}
                      </span>
                    )}
                  </div>

                  <div className="visit-subsection__field">
                    <label htmlFor="followUpHour">
                      {t('health.visit.followUpHour')}
                    </label>
                    <div className="input-with-icon">
                      <FaClock className="input-icon" />
                      <input
                        id="followUpHour"
                        type="time"
                        {...register('followUpHour')}
                        className={errors.followUpHour ? 'input-error' : ''}
                      />
                    </div>
                  </div>

                  <div className="visit-subsection__field">
                    <label htmlFor="veterinarian">
                      {t('health.visit.veterinarian')}
                    </label>
                    <div className="input-with-icon">
                      <FaUserMd className="input-icon" />
                      <input
                        id="veterinarian"
                        type="text"
                        placeholder={t('health.visit.veterinarianPlaceholder')}
                        {...register('veterinarian', {
                          maxLength: {
                            value: 200,
                            message: t('health.visit.veterinarianMaxLength'),
                          },
                        })}
                        className={errors.veterinarian ? 'input-error' : ''}
                      />
                    </div>
                    {errors.veterinarian && (
                      <span className="error-message">
                        {errors.veterinarian.message}
                      </span>
                    )}
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

              <div className="visit-subsection__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  variant="primary"
                >
                  {editingVetVisit ? t('common.update') : t('common.save')}
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
      </div>

      {/* Sección 2: Recordatorios */}
      <RemindersSection
        petId={pet.id || null}
        // context="visit"
        defaultTitle={t('health.visit.nextReminder', { petName: pet.name })}
        defaultDescription={t('health.visit.reminderDescription')}
      />

      {/* Sección 3: Historial de Visitas Veterinarias */}
      <div className="pet-section-card pet-section-card--visit-history">
        <div className="visit-subsection__history-header">
          <div>
            <FaStethoscope className="history-icon" />
            <h3>{t('health.visit.history')}</h3>
          </div>
          <p>{t('health.visit.historyDescription')}</p>
        </div>

        {crudError && (
          <div className="server-error">
            <p>
              {t('common.error')}: {crudError}
            </p>
          </div>
        )}

        {loading && vetVisits.length === 0 ? (
          <Loader text={t('health.visit.loading')} />
        ) : vetVisits.length === 0 ? (
          <p className="visit-subsection__empty">
            {t('health.visit.empty')}
          </p>
        ) : (
          <div className="visit-subsection__visits-list">
            {vetVisits.map((vetVisit) => (
              <div key={vetVisit.id} className="visit-subsection__visit-card">
                <div className="visit-card__header">
                  <div className="visit-card__title">
                    <FaStethoscope className="visit-icon" />
                    <h4>
                      {vetVisit.reason || t('health.visit.defaultReason')}
                    </h4>
                  </div>
                  <div className="visit-card__actions">
                    <button
                      className="visit-card__action-btn"
                      onClick={() => handleEditClick(vetVisit)}
                      aria-label={t('common.edit')}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="visit-card__action-btn visit-card__action-btn--delete"
                      onClick={() => handleDeleteClick(vetVisit)}
                      aria-label={t('common.delete')}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="visit-card__details">
                  <div className="visit-card__detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <label>{t('health.visit.visitDate')}</label>
                      <p>{formatDateTimeLocal(vetVisit.visitDate)}</p>
                    </div>
                  </div>

                  {vetVisit.followUpDate && (
                    <div className="visit-card__detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <label>{t('health.visit.followUpDate')}</label>
                        <p>{formatDateTimeLocal(vetVisit.followUpDate)}</p>
                      </div>
                    </div>
                  )}

                  {vetVisit.veterinarian && (
                    <div className="visit-card__detail-item">
                      <FaUserMd className="detail-icon" />
                      <div>
                        <label>{t('health.visit.veterinarian')}</label>
                        <p>{vetVisit.veterinarian}</p>
                      </div>
                    </div>
                  )}

                  {vetVisit.diagnosis && (
                    <div className="visit-card__detail-item">
                      <label>{t('health.visit.diagnosis')}</label>
                      <p>{vetVisit.diagnosis}</p>
                    </div>
                  )}

                  {vetVisit.treatment && (
                    <div className="visit-card__detail-item">
                      <label>{t('health.visit.treatment')}</label>
                      <p>{vetVisit.treatment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
