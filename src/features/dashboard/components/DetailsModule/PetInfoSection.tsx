import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import type { Pet } from '../../../../models/pet.model';
import { usePetStore } from '../../../../store/pet.store';
import { usePetForm } from '../../../../hooks/usePetForm';
import { Button } from '../../../../components/Button/Button';
import { Select } from '../../../../components/Select';
import { FaRegEdit, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { FileText } from 'lucide-react';
import { useDocumentModalStore } from '../../../../store/documentModal.store';
import { formatPetAge } from '../../../../utils/dateUtils';
import { getSexLabel } from '../../../../utils/sexUtils';
import { getSpeciesLabel } from '../../../../utils/speciesUtils';
import './PetInfoSection.scss';

interface PetInfoSectionProps {
  pet: Pet;
}

export default function PetInfoSection({ pet }: PetInfoSectionProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const updatePet = usePetStore((s) => s.updatePet);
  const { loading, error, fetchPetDocuments, documents } = usePetStore();
  const openDocumentUpload = useDocumentModalStore((s) => s.openUpload);
  const openDocumentView = useDocumentModalStore((s) => s.openView);

  // Cargar documentos al montar
  useEffect(() => {
    fetchPetDocuments(pet.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet.id]);

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    onSubmit,
    handleCancel,
    control,
  } = usePetForm({
    editingPet: isEditing ? pet : null,
    onSave: async (data) => {
      await updatePet(pet.id, data);
    },
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelForm = () => {
    handleCancel();
    setIsEditing(false);
  };

  return (
    <div className="pet-info-subsection">
      <div className="pet-section-card pet-section-card--info">
        <div className="pet-info-subsection__header">
          <div className="pet-info-subsection__title">
            <h3>{t('pet.details.info')}</h3>
            <p>{t('pet.details.infoDescription')}</p>
          </div>
          {!isEditing && (
            <div className="pet-info-subsection__header-actions">
              <Button
                variant="outline"
                onClick={() => openDocumentUpload(pet.id)}
              >
                <FileText size={18} style={{ marginRight: '0.5rem' }} />
                <span>{t('pet.details.uploadDocument')}</span>
              </Button>
              {documents.length > 0 && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    // Recargar documentos para asegurar que estén actualizados
                    await fetchPetDocuments(pet.id);
                    // Usar el estado actualizado del store
                    const updatedDocuments = usePetStore.getState().documents;
                    if (updatedDocuments.length > 0) {
                      openDocumentView(pet.id, updatedDocuments);
                    } else {
                      // Si no hay documentos después de recargar, usar los que ya tenemos
                      openDocumentView(pet.id, documents);
                    }
                  }}
                >
                  <FileText size={18} style={{ marginRight: '0.5rem' }} />
                  <span>
                    {t('pet.details.viewDocuments', {
                      count: documents.length,
                    })}
                  </span>
                </Button>
              )}
              <Button variant="primary" onClick={handleEditClick}>
                <FaRegEdit style={{ marginRight: '4px' }} size={12} />{' '}
                <span style={{ fontSize: '1.2rem' }}>
                  {t('pet.details.edit')} {t('pet.details.info')}
                </span>
              </Button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="pet-info-subsection__form-section">
            <h4>
              {t('pet.details.edit')} {t('pet.details.info')}
            </h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="pet-info-subsection__form"
            >
              <div className="pet-info-subsection__form-grid">
                {/* Columna Izquierda */}
                <div className="pet-info-subsection__form-column">
                  <div className="pet-info-subsection__field">
                    <label htmlFor="name">{t('pet.form.name')}</label>
                    <input
                      id="name"
                      type="text"
                      placeholder={t('pet.form.namePlaceholder')}
                      {...register('name', {
                        maxLength: {
                          value: 100,
                          message: t('auth.validation.nameMaxLength'),
                        },
                      })}
                      className={errors.name ? 'input-error' : ''}
                    />
                    {errors.name && (
                      <span className="error-message">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className="pet-info-subsection__field">
                    <label htmlFor="species">{t('pet.form.species')}</label>
                    <input
                      id="species"
                      type="text"
                      placeholder={t('pet.form.speciesPlaceholder')}
                      {...register('species', {
                        maxLength: {
                          value: 50,
                          message: t('auth.validation.speciesMaxLength'),
                        },
                      })}
                      className={errors.species ? 'input-error' : ''}
                    />
                    {errors.species && (
                      <span className="error-message">
                        {errors.species.message}
                      </span>
                    )}
                  </div>

                  <div className="pet-info-subsection__field">
                    <label htmlFor="breed">{t('pet.form.breed')}</label>
                    <input
                      id="breed"
                      type="text"
                      placeholder={t('pet.form.breedPlaceholder')}
                      {...register('breed', {
                        maxLength: {
                          value: 100,
                          message: t('auth.validation.breedMaxLength'),
                        },
                      })}
                      className={errors.breed ? 'input-error' : ''}
                    />
                    {errors.breed && (
                      <span className="error-message">
                        {errors.breed.message}
                      </span>
                    )}
                  </div>

                  <div className="pet-info-subsection__field">
                    <label htmlFor="birthDate">{t('pet.form.birthDate')}</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="birthDate"
                        type="date"
                        {...register('birthDate', {
                          validate: (value) => {
                            if (!value) return true; // Opcional
                            if (isNaN(Date.parse(value))) {
                              return t('auth.validation.dateInvalid');
                            }
                            return true;
                          },
                        })}
                        className={errors.birthDate ? 'input-error' : ''}
                      />
                    </div>
                    {errors.birthDate && (
                      <span className="error-message">
                        {errors.birthDate.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="pet-info-subsection__form-column">
                  <div className="pet-info-subsection__field">
                    <label htmlFor="weightKg">{t('pet.form.weight')}</label>
                    <input
                      id="weightKg"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t('pet.form.weightPlaceholder')}
                      {...register('weightKg', {
                        validate: (value) => {
                          if (!value) return true; // Opcional
                          const num = Number(value);
                          if (isNaN(num) || num < 0 || num > 999.99) {
                            return t('auth.validation.weightRange');
                          }
                          return true;
                        },
                      })}
                      className={errors.weightKg ? 'input-error' : ''}
                    />
                    {errors.weightKg && (
                      <span className="error-message">
                        {errors.weightKg.message}
                      </span>
                    )}
                  </div>

                  <div className="pet-info-subsection__field">
                    <Controller
                      name="sex"
                      control={control}
                      rules={{
                        maxLength: {
                          value: 20,
                          message: t('auth.validation.sexMaxLength'),
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <Select
                            label={t('pet.form.sex')}
                            value={field.value || null}
                            onChange={(value) => field.onChange(value || '')}
                            options={[
                              {
                                value: 'Macho',
                                label: t('pet.form.sexOptions.macho'),
                              },
                              {
                                value: 'Hembra',
                                label: t('pet.form.sexOptions.hembra'),
                              },
                            ]}
                            placeholder={t('pet.form.selectPlaceholder')}
                          />
                          {errors.sex && (
                            <span className="error-message">
                              {errors.sex.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="pet-info-subsection__field">
                    <label htmlFor="photoUrl">{t('pet.form.photoUrl')}</label>
                    <input
                      id="photoUrl"
                      type="url"
                      placeholder={t('pet.form.photoUrlPlaceholder')}
                      {...register('photoUrl')}
                      className={errors.photoUrl ? 'input-error' : ''}
                    />
                    {errors.photoUrl && (
                      <span className="error-message">
                        {errors.photoUrl.message}
                      </span>
                    )}
                    <small style={{ color: '#666', fontSize: '0.85rem' }}>
                      {t('common.optional')}: {t('pet.form.photoUrlHint')}
                    </small>
                  </div>

                  <div className="pet-info-subsection__field">
                    <label htmlFor="notes">{t('pet.form.notes')}</label>
                    <div className="input-with-icon">
                      <FaFileAlt className="input-icon" />
                      <textarea
                        id="notes"
                        rows={4}
                        placeholder={t('pet.form.notesPlaceholder')}
                        {...register('notes')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="server-error">
                  <p>
                    {t('common.error')}: {error}
                  </p>
                </div>
              )}

              <div className="pet-info-subsection__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid || !isDirty}
                  variant="primary"
                >
                  {t('common.save')}
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

        {!isEditing && (
          <div className="pet-info-subsection__info-grid">
            <div className="info-item">
              <label>{t('pet.form.name')}</label>
              <p>{pet.name}</p>
            </div>
            <div className="info-item">
              <label>{t('pet.form.species')}</label>
              <p>{getSpeciesLabel(pet.species) || '—'}</p>
            </div>
            <div className="info-item">
              <label>{t('pet.form.breed')}</label>
              <p>{pet.breed || '—'}</p>
            </div>
            <div className="info-item">
              <label>{t('pet.form.birthDate')}</label>
              <p>{pet.birthDate ? pet.birthDate.split('T')[0] : '—'}</p>
            </div>
            <div className="info-item">
              <label>{t('pet.card.age')}</label>
              <p>{formatPetAge(pet.ageYears)}</p>
            </div>
            <div className="info-item">
              <label>{t('common.weight')}</label>
              <p>{pet.weightKg ? `${pet.weightKg} ${t('common.kg')}` : '—'}</p>
            </div>
            <div className="info-item">
              <label>{t('pet.form.sex')}</label>
              <p>{getSexLabel(pet.sex) || '—'}</p>
            </div>
            {pet.photoUrl && (
              <div className="info-item">
                <label>{t('pet.form.photoUrl')}</label>
                <p>
                  <a
                    href={pet.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('pet.details.viewPhoto')}
                  </a>
                </p>
              </div>
            )}
            {pet.notes && (
              <div className="info-item info-item--full">
                <label>{t('pet.form.notes')}</label>
                <p>{pet.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
