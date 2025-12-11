import { useState } from 'react';
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
      title: `¿Estás seguro que quieres eliminar "${vaccine.vaccineName}"?`,
      content: 'Esta acción no se puede deshacer',
      variant: 'confirm',
      onConfirm: () => {
        deleteVaccine(vaccine.id);
      },
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
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
            <h3>Registro de Vacunación</h3>
            <p>Gestiona el historial de vacunas de {pet.name}</p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              onClick={handleAddClick}
              style={{ fontSize: '1.2rem' }}
            >
              <FaPlus style={{ marginRight: '4px' }} /> Agregar Vacuna
            </Button>
          )}
        </div>

        {showForm && (
          <div className="vaccination-subsection__form-section">
            <h4>
              {editingVaccine ? 'Editar Vacuna' : 'Registrar Nueva Vacuna'}
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
                      Nombre de la Vacuna <span className="required">*</span>
                    </label>
                    <input
                      id="vaccineName"
                      type="text"
                      placeholder="Ej: Rabia, Parvovirus, Moquillo..."
                      {...register('vaccineName', {
                        required: 'El nombre de la vacuna es obligatorio',
                        minLength: {
                          value: 1,
                          message: 'El nombre debe tener al menos 1 carácter',
                        },
                        maxLength: {
                          value: 200,
                          message: 'El nombre no puede exceder 200 caracteres',
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
                      Fecha de Aplicación <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="dateAdministered"
                        type="date"
                        {...register('dateAdministered', {
                          required: 'La fecha de aplicación es obligatoria',
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
                    <label htmlFor="nextDue">Próxima Fecha</label>
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
                              return 'La próxima fecha debe ser posterior a la fecha de aplicación';
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
                    <label htmlFor="veterinarian">Veterinario</label>
                    <div className="input-with-icon">
                      <FaUserMd className="input-icon" />
                      <input
                        id="veterinarian"
                        type="text"
                        placeholder="Ej: Dr. Carlos Martínez"
                        {...register('veterinarian', {
                          maxLength: {
                            value: 200,
                            message:
                              'El veterinario no puede exceder 200 caracteres',
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
                    <label htmlFor="manufacturer">Fabricante</label>
                    <input
                      id="manufacturer"
                      type="text"
                      placeholder="Ej: Pfizer, Merial..."
                      {...register('manufacturer', {
                        maxLength: {
                          value: 200,
                          message:
                            'El fabricante no puede exceder 200 caracteres',
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
                    <label htmlFor="lotNumber">Número de Lote</label>
                    <input
                      id="lotNumber"
                      type="text"
                      placeholder="Ej: RAB-2024-1234"
                      {...register('lotNumber', {
                        maxLength: {
                          value: 100,
                          message:
                            'El número de lote no puede exceder 100 caracteres',
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
                    <label htmlFor="notes">Notas (opcional)</label>
                    <div className="input-with-icon">
                      <FaFileAlt className="input-icon" />
                      <textarea
                        id="notes"
                        rows={4}
                        placeholder="Observaciones adicionales..."
                        {...register('notes')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {crudError && (
                <div className="server-error">
                  <p>Error: {crudError}</p>
                </div>
              )}

              <div className="vaccination-subsection__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  variant="primary"
                >
                  {editingVaccine ? 'Actualizar Registro' : 'Guardar Registro'}
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
      </div>

      {/* Sección 2: Recordatorios */}
      <RemindersSection
        petId={pet.id || null}
        // context="vaccination"
        defaultTitle={`Próxima vacuna - ${pet.name}`}
        defaultDescription="Recordatorio para aplicar vacuna"
      />

      {/* Sección 3: Historial de Vacunación */}
      <div className="pet-section-card pet-section-card--vaccination-history">
        <div className="vaccination-subsection__history-header">
          <div>
            <FaSyringe className="history-icon" />
            <h3>Historial de Vacunación</h3>
          </div>
          <p>Registro completo de todas las vacunas aplicadas</p>
        </div>

        {crudError && (
          <div className="server-error">
            <p>Error: {crudError}</p>
          </div>
        )}

        {loading && vaccines.length === 0 ? (
          <Loader text="Cargando vacunas..." />
        ) : vaccines.length === 0 ? (
          <p className="vaccination-subsection__empty">
            No hay vacunas registradas aún
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
                      aria-label="Editar vacuna"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="vaccine-card__action-btn vaccine-card__action-btn--delete"
                      onClick={() => handleDeleteClick(vaccine)}
                      aria-label="Eliminar vacuna"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {isExpired(vaccine.nextDue) && (
                  <span className="vaccine-card__badge vaccine-card__badge--expired">
                    Vencida
                  </span>
                )}

                <div className="vaccine-card__details">
                  <div className="vaccine-card__detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <label>Fecha de Aplicación</label>
                      <p>{formatDateLocal(vaccine.dateAdministered)}</p>
                    </div>
                  </div>

                  {vaccine.nextDue && (
                    <div className="vaccine-card__detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <label>Próxima Dosis</label>
                        <p>{formatDateLocal(vaccine.nextDue)}</p>
                      </div>
                    </div>
                  )}

                  {vaccine.veterinarian && (
                    <div className="vaccine-card__detail-item">
                      <FaUserMd className="detail-icon" />
                      <div>
                        <label>Veterinario</label>
                        <p>{vaccine.veterinarian}</p>
                      </div>
                    </div>
                  )}

                  {vaccine.manufacturer && (
                    <div className="vaccine-card__detail-item">
                      <label>Fabricante</label>
                      <p>{vaccine.manufacturer}</p>
                    </div>
                  )}

                  {vaccine.lotNumber && (
                    <div className="vaccine-card__detail-item">
                      <label>Número de Lote</label>
                      <p>{vaccine.lotNumber}</p>
                    </div>
                  )}

                  {vaccine.notes && (
                    <div className="vaccine-card__detail-item">
                      <label>Notas</label>
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
