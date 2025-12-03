import { useState } from 'react';
import type { Pet } from '../../../../../models/pet.model';
import type { Deworming } from '../../../../../models/deworming.model';
import { useDewormingForm } from '../../../../../hooks/useDewormingForm';
import { useDewormingCrud } from '../../../../../hooks/useDewormingCrud';
import { Button } from '../../../../../components/Button/Button';
import { RemindersSection } from '../RemindersSection/RemindersSection';
import { useModalStore } from '../../../../../store/modal.store';
import {
  FaBug,
  FaCalendarAlt,
  FaUserMd,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from 'react-icons/fa';
import './PetDewormingSubsection.scss';

interface PetDewormingSubsectionProps {
  pet: Pet;
}

export const PetDewormingSubsection: React.FC<PetDewormingSubsectionProps> = ({
  pet,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDeworming, setEditingDeworming] = useState<Deworming | null>(
    null,
  );
  const { openModal } = useModalStore();

  const {
    dewormings,
    loading: crudLoading,
    error: crudError,
    createDeworming,
    updateDeworming,
    deleteDeworming,
  } = useDewormingCrud({ petId: pet.id || '' });

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    watch,
  } = useDewormingForm({
    editingDeworming,
    onSave: async (data) => {
      if (editingDeworming) {
        await updateDeworming(editingDeworming.id, data);
      } else {
        await createDeworming(data);
      }
    },
    onSuccess: () => {
      setShowForm(false);
      setEditingDeworming(null);
    },
  });

  const loading = crudLoading;

  const handleAddClick = () => {
    setEditingDeworming(null);
    setShowForm(true);
  };

  const handleEditClick = (deworming: Deworming) => {
    setEditingDeworming(deworming);
    setShowForm(true);
  };

  const handleDeleteClick = (deworming: Deworming) => {
    const medicationName = deworming.medication || 'esta desparasitación';
    openModal({
      title: `¿Estás seguro que quieres eliminar "${medicationName}"?`,
      content: 'Esta acción no se puede deshacer',
      variant: 'confirm',
      onConfirm: () => {
        deleteDeworming(deworming.id);
      },
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    });
  };

  const handleCancelForm = () => {
    handleCancel();
    setShowForm(false);
    setEditingDeworming(null);
  };

  const isExpired = (nextDue: string | null | undefined): boolean => {
    if (!nextDue) return false;
    return new Date(nextDue) < new Date();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const dateAdministeredValue = watch('dateAdministered');

  return (
    <div className="deworming-subsection">
      {/* Sección 1: Registro de Desparasitación */}
      <div className="pet-section-card pet-section-card--deworming">
        <div className="deworming-subsection__header">
          <div>
            <h3>Registro de Desparasitación</h3>
            <p>Gestiona el historial de desparasitaciones de {pet.name}</p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              onClick={handleAddClick}
              style={{ fontSize: '1.2rem' }}
            >
              <FaPlus style={{ position: 'relative', left: '-4px' }} /> Agregar
              Desparasitación
            </Button>
          )}
        </div>

        {showForm && (
          <div className="deworming-subsection__form-section">
            <h4>
              {editingDeworming
                ? 'Editar Desparasitación'
                : 'Registrar Nueva Desparasitación'}
            </h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="deworming-subsection__form"
            >
              <div className="deworming-subsection__form-grid">
                {/* Columna Izquierda */}
                <div className="deworming-subsection__form-column">
                  <div className="deworming-subsection__field">
                    <label htmlFor="medication">Nombre del Producto</label>
                    <input
                      id="medication"
                      type="text"
                      placeholder="Ej: Drontal Plus, Bravecto..."
                      {...register('medication', {
                        maxLength: {
                          value: 200,
                          message:
                            'El nombre del producto no puede exceder 200 caracteres',
                        },
                      })}
                      className={errors.medication ? 'input-error' : ''}
                    />
                    {errors.medication && (
                      <span className="error-message">
                        {errors.medication.message}
                      </span>
                    )}
                  </div>

                  <div className="deworming-subsection__field">
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

                  <div className="deworming-subsection__field">
                    <label htmlFor="nextDue">Próxima Fecha</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="nextDue"
                        type="date"
                        {...register('nextDue', {
                          validate: (value) => {
                            if (!value) return true; // Opcional
                            if (
                              dateAdministeredValue &&
                              value <= dateAdministeredValue
                            ) {
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
                </div>

                {/* Columna Derecha */}
                <div className="deworming-subsection__form-column">
                  <div className="deworming-subsection__field">
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

                  <div className="deworming-subsection__field">
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

              <div className="deworming-subsection__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  variant="primary"
                >
                  {editingDeworming
                    ? 'Actualizar Registro'
                    : 'Guardar Registro'}
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
        // context="deworming"
        defaultTitle={`Próxima desparasitación - ${pet.name}`}
        defaultDescription="Recordatorio para aplicar desparasitación"
      />

      {/* Sección 3: Historial de Desparasitación */}
      <div className="pet-section-card pet-section-card--deworming-history">
        <div className="deworming-subsection__history-header">
          <div>
            <FaBug className="history-icon" />
            <h3>Historial de Desparasitación</h3>
          </div>
          <p>Registro completo de todas las desparasitaciones</p>
        </div>

        {crudError && (
          <div className="server-error">
            <p>Error: {crudError}</p>
          </div>
        )}

        {loading && dewormings.length === 0 ? (
          <p className="deworming-subsection__loading">
            Cargando desparasitaciones...
          </p>
        ) : dewormings.length === 0 ? (
          <p className="deworming-subsection__empty">
            No hay desparasitaciones registradas aún
          </p>
        ) : (
          <div className="deworming-subsection__dewormings-list">
            {dewormings.map((deworming) => (
              <div
                key={deworming.id}
                className="deworming-subsection__deworming-card"
              >
                <div className="deworming-card__header">
                  <div className="deworming-card__title">
                    <FaBug className="deworming-icon" />
                    <h4>{deworming.medication || 'Sin nombre'}</h4>
                  </div>
                  <div className="deworming-card__actions">
                    <button
                      className="deworming-card__action-btn"
                      onClick={() => handleEditClick(deworming)}
                      aria-label="Editar desparasitación"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="deworming-card__action-btn deworming-card__action-btn--delete"
                      onClick={() => handleDeleteClick(deworming)}
                      aria-label="Eliminar desparasitación"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {isExpired(deworming.nextDue) && (
                  <span className="deworming-card__badge deworming-card__badge--expired">
                    Vencida
                  </span>
                )}

                <div className="deworming-card__details">
                  <div className="deworming-card__detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <label>Fecha de Aplicación</label>
                      <p>{formatDate(deworming.dateAdministered)}</p>
                    </div>
                  </div>

                  {deworming.nextDue && (
                    <div className="deworming-card__detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <label>Próxima Aplicación</label>
                        <p>{formatDate(deworming.nextDue)}</p>
                      </div>
                    </div>
                  )}

                  {deworming.veterinarian && (
                    <div className="deworming-card__detail-item">
                      <FaUserMd className="detail-icon" />
                      <div>
                        <label>Veterinario</label>
                        <p>{deworming.veterinarian}</p>
                      </div>
                    </div>
                  )}

                  {deworming.notes && (
                    <div className="deworming-card__detail-item">
                      <label>Notas</label>
                      <p>{deworming.notes}</p>
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
