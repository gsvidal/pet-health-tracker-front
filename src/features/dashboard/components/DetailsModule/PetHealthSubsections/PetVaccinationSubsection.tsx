import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../../../../../models/pet.model';
import type { Vaccine } from '../../../../../models/vaccine.model';
import { useVaccineForm } from '../../../../../hooks/useVaccineForm';
import { useVaccineCrud } from '../../../../../hooks/useVaccineCrud';
import { Button } from '../../../../../components/Button/Button';
import { RemindersSection } from '../RemindersSection/RemindersSection';
import { Loader } from '../../../../../components/Loader/Loader';
import { formatDateLocal } from '../../../../../utils/dateUtils';
import {
  FaSyringe,
  FaCalendarAlt,
  FaUserMd,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from 'react-icons/fa';
import './PetVaccinationSubsection.scss';
import { useModalStore } from '../../../../../store/modal.store';

interface PetVaccinationSubsectionProps {
  pet: Pet;
}

export const PetVaccinationSubsection: React.FC<
  PetVaccinationSubsectionProps
> = ({ pet }) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);
  const { openModal } = useModalStore();

  const {
    vaccines,
    loading: crudLoading,
    error: crudError,
    createVaccine,
    updateVaccine,
    deleteVaccine,
  } = useVaccineCrud({ petId: pet.id || '' });

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    watch,
  } = useVaccineForm({
    editingVaccine,
    onSave: async (data) => {
      if (editingVaccine) {
        await updateVaccine(editingVaccine.id, data);
      } else {
        await createVaccine(data);
      }
    },
    onSuccess: () => {
      setShowForm(false);
      setEditingVaccine(null);
    },
  });

  const loading = crudLoading;

  const handleAddClick = () => {
    setEditingVaccine(null);
    setShowForm(true);
  };

  const handleEditClick = (vaccine: Vaccine) => {
    setEditingVaccine(vaccine);
    setShowForm(true);
  };

  const handleDeleteClick = (vaccine: Vaccine) => {
    openModal({
      title: t('modals.delete.title'),
      content: t('modals.delete.content'),
      variant: 'confirm',
      onConfirm: () => {
        deleteVaccine(vaccine.id);
      },
      confirmLabel: t('common.delete'),
      cancelLabel: t('common.cancel'),
    });
  };

  const handleCancelForm = () => {
    handleCancel();
    setShowForm(false);
    setEditingVaccine(null);
  };

  const isExpired = (nextDue: string | null | undefined): boolean => {
    if (!nextDue) return false;
    return new Date(nextDue) < new Date();
  };

  // import { formatDateLocal } from '../../../../../utils/dateUtils';

  return (
    <div className="vaccination-subsection">
      {/* Sección 1: Registro de Vacunación */}
      <div className="vaccination-section-card pet-section-card pet-section-card--vaccination">
        <div className="vaccination-subsection__header">
          <div className="vaccination-subsection__title">
            <h3>{t('health.vaccination.title')}</h3>
            <p>
              {t('health.vaccination.manageHistory', { petName: pet.name })}
            </p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              onClick={handleAddClick}
              style={{ fontSize: '1.2rem' }}
            >
              <FaPlus style={{ marginRight: '4px' }} />{' '}
              {t('health.vaccination.add')}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="vaccination-subsection__form-section">
            <h4>
              {editingVaccine
                ? t('health.vaccination.edit')
                : t('health.vaccination.registerNew')}
            </h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="vaccination-subsection__form"
            >
              <div className="vaccination-subsection__form-grid">
                {/* Columna Izquierda */}
                <div className="vaccination-subsection__form-column">
                  <div className="vaccination-subsection__field">
                    <label htmlFor="vaccineName">
                      {t('health.vaccination.name')}{' '}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="vaccineName"
                      type="text"
                      placeholder={t('health.vaccination.namePlaceholder')}
                      {...register('vaccineName', {
                        required: t('health.vaccination.nameRequired'),
                        minLength: {
                          value: 1,
                          message: t('health.vaccination.nameMinLength'),
                        },
                        maxLength: {
                          value: 200,
                          message: t('health.vaccination.nameMaxLength'),
                        },
                      })}
                      className={errors.vaccineName ? 'input-error' : ''}
                    />
                    {errors.vaccineName && (
                      <span className="error-message">
                        {errors.vaccineName.message}
                      </span>
                    )}
                  </div>

                  <div className="vaccination-subsection__field">
                    <label htmlFor="dateAdministered">
                      {t('health.vaccination.dateAdministered')}{' '}
                      <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="dateAdministered"
                        type="date"
                        {...register('dateAdministered', {
                          required: t('health.vaccination.dateRequired'),
                        })}
                        className={errors.dateAdministered ? 'input-error' : ''}
                      />
                    </div>
                    {errors.dateAdministered && (
                      <span className="error-message">
                        {errors.dateAdministered.message}
                      </span>
                    )}
                  </div>

                  <div className="vaccination-subsection__field">
                    <label htmlFor="nextDue">
                      {t('health.vaccination.nextDue')}
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="nextDue"
                        type="date"
                        {...register('nextDue', {
                          validate: (value) => {
                            if (!value) return true; // Opcional
                            const dateAdministered = watch('dateAdministered');
                            if (dateAdministered && value <= dateAdministered) {
                              return t('health.vaccination.nextDueAfter');
                            }
                            return true;
                          },
                        })}
                        className={errors.nextDue ? 'input-error' : ''}
                      />
                    </div>
                    {errors.nextDue && (
                      <span className="error-message">
                        {errors.nextDue.message}
                      </span>
                    )}
                  </div>

                  <div className="vaccination-subsection__field">
                    <label htmlFor="veterinarian">
                      {t('health.vaccination.veterinarian')}
                    </label>
                    <div className="input-with-icon">
                      <FaUserMd className="input-icon" />
                      <input
                        id="veterinarian"
                        type="text"
                        placeholder={t(
                          'health.vaccination.veterinarianPlaceholder',
                        )}
                        {...register('veterinarian', {
                          maxLength: {
                            value: 200,
                            message: t(
                              'health.vaccination.veterinarianMaxLength',
                            ),
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

                {/* Columna Derecha */}
                <div className="vaccination-subsection__form-column">
                  <div className="vaccination-subsection__field">
                    <label htmlFor="manufacturer">
                      {t('health.vaccination.manufacturer')}
                    </label>
                    <input
                      id="manufacturer"
                      type="text"
                      placeholder={t(
                        'health.vaccination.manufacturerPlaceholder',
                      )}
                      {...register('manufacturer', {
                        maxLength: {
                          value: 200,
                          message: t(
                            'health.vaccination.manufacturerMaxLength',
                          ),
                        },
                      })}
                      className={errors.manufacturer ? 'input-error' : ''}
                    />
                    {errors.manufacturer && (
                      <span className="error-message">
                        {errors.manufacturer.message}
                      </span>
                    )}
                  </div>

                  <div className="vaccination-subsection__field">
                    <label htmlFor="lotNumber">
                      {t('health.vaccination.lotNumber')}
                    </label>
                    <input
                      id="lotNumber"
                      type="text"
                      placeholder={t('health.vaccination.lotNumberPlaceholder')}
                      {...register('lotNumber', {
                        maxLength: {
                          value: 100,
                          message: t('health.vaccination.lotNumberMaxLength'),
                        },
                      })}
                      className={errors.lotNumber ? 'input-error' : ''}
                    />
                    {errors.lotNumber && (
                      <span className="error-message">
                        {errors.lotNumber.message}
                      </span>
                    )}
                  </div>

                  <div className="vaccination-subsection__field">
                    <label htmlFor="notes">
                      {t('health.vaccination.notes')}
                    </label>
                    <div className="input-with-icon">
                      <FaFileAlt className="input-icon" />
                      <textarea
                        id="notes"
                        rows={4}
                        placeholder={t('health.vaccination.notesPlaceholder')}
                        {...register('notes')}
                      />
                    </div>
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

              <div className="vaccination-subsection__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  variant="primary"
                >
                  {editingVaccine ? t('common.update') : t('common.save')}
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
        // context="vaccination"
        defaultTitle={t('health.vaccination.nextReminder', {
          petName: pet.name,
        })}
        defaultDescription={t('health.vaccination.reminderDescription')}
      />

      {/* Sección 3: Historial de Vacunación */}
      <div className="pet-section-card pet-section-card--vaccination-history">
        <div className="vaccination-subsection__history-header">
          <div>
            <FaSyringe className="history-icon" />
            <h3>{t('health.vaccination.history')}</h3>
          </div>
          <p>{t('health.vaccination.historyDescription')}</p>
        </div>

        {crudError && (
          <div className="server-error">
            <p>
              {t('common.error')}: {crudError}
            </p>
          </div>
        )}

        {loading && vaccines.length === 0 ? (
          <Loader text={t('common.loading')} />
        ) : vaccines.length === 0 ? (
          <p className="vaccination-subsection__empty">
            {t('health.vaccination.empty')}
          </p>
        ) : (
          <div className="vaccination-subsection__vaccines-list">
            {vaccines.map((vaccine) => (
              <div
                key={vaccine.id}
                className="vaccination-subsection__vaccine-card"
              >
                <div className="vaccine-card__header">
                  <div className="vaccine-card__title">
                    <FaSyringe className="vaccine-icon" />
                    <h4>{vaccine.vaccineName}</h4>
                  </div>
                  <div className="vaccine-card__actions">
                    <button
                      className="vaccine-card__action-btn"
                      onClick={() => handleEditClick(vaccine)}
                      aria-label={t('common.edit')}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="vaccine-card__action-btn vaccine-card__action-btn--delete"
                      onClick={() => handleDeleteClick(vaccine)}
                      aria-label={t('common.delete')}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {isExpired(vaccine.nextDue) && (
                  <span className="vaccine-card__badge vaccine-card__badge--expired">
                    {t('health.vaccination.expired')}
                  </span>
                )}

                <div className="vaccine-card__details">
                  <div className="vaccine-card__detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <label>{t('health.vaccination.dateAdministered')}</label>
                      <p>{formatDateLocal(vaccine.dateAdministered)}</p>
                    </div>
                  </div>

                  {vaccine.nextDue && (
                    <div className="vaccine-card__detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <label>{t('health.vaccination.nextDose')}</label>
                        <p>{formatDateLocal(vaccine.nextDue)}</p>
                      </div>
                    </div>
                  )}

                  {vaccine.veterinarian && (
                    <div className="vaccine-card__detail-item">
                      <FaUserMd className="detail-icon" />
                      <div>
                        <label>{t('health.vaccination.veterinarian')}</label>
                        <p>{vaccine.veterinarian}</p>
                      </div>
                    </div>
                  )}

                  {vaccine.manufacturer && (
                    <div className="vaccine-card__detail-item">
                      <label>{t('health.vaccination.manufacturer')}</label>
                      <p>{vaccine.manufacturer}</p>
                    </div>
                  )}

                  {vaccine.lotNumber && (
                    <div className="vaccine-card__detail-item">
                      <label>{t('health.vaccination.lotNumber')}</label>
                      <p>{vaccine.lotNumber}</p>
                    </div>
                  )}

                  {vaccine.notes && (
                    <div className="vaccine-card__detail-item">
                      <label>{t('health.vaccination.notes')}</label>
                      <p>{vaccine.notes}</p>
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
