import { useState } from 'react';
import type { Pet } from '../../../../../models/pet.model';
import type { VetVisit } from '../../../../../models/vetVisit.model';
import { useVetVisitForm } from '../../../../../hooks/useVetVisitForm';
import { useVetVisitCrud } from '../../../../../hooks/useVetVisitCrud';
import { Button } from '../../../../../components/Button/Button';
import { RemindersSection } from '../RemindersSection/RemindersSection';
import { useModalStore } from '../../../../../store/modal.store';
import { formatDateLocal, formatDateTimeLocal } from '../../../../../utils/dateUtils';
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
  const [showForm, setShowForm] = useState(false);
  const [editingVetVisit, setEditingVetVisit] = useState<VetVisit | null>(
    null,
  );
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
    const reasonText = vetVisit.reason || 'esta visita';
    openModal({
      title: `¿Estás seguro que quieres eliminar "${reasonText}"?`,
      content: 'Esta acción no se puede deshacer',
      variant: 'confirm',
      onConfirm: () => {
        deleteVetVisit(vetVisit.id);
      },
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
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
            <h3>Registro de Visita Veterinaria</h3>
            <p>Gestiona el historial de visitas veterinarias de {pet.name}</p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              onClick={handleAddClick}
              style={{ fontSize: '1.2rem' }}
            >
              <FaPlus style={{ position: 'relative', left: '-4px' }} /> Agregar
              Visita
            </Button>
          )}
        </div>

        {showForm && (
          <div className="visit-subsection__form-section">
            <h4>
              {editingVetVisit
                ? 'Editar Visita Veterinaria'
                : 'Registrar Nueva Visita Veterinaria'}
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
                      Fecha de Visita <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="visitDate"
                        type="date"
                        {...register('visitDate', {
                          required: 'La fecha de visita es obligatoria',
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
                      Hora de Visita <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaClock className="input-icon" />
                      <input
                        id="visitHour"
                        type="time"
                        {...register('visitHour', {
                          required: 'La hora de visita es obligatoria',
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
                    <label htmlFor="reason">Motivo de la Visita</label>
                    <input
                      id="reason"
                      type="text"
                      placeholder="Ej: Consulta general, Revisión anual..."
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
                    <label htmlFor="diagnosis">Diagnóstico</label>
                    <div className="input-with-icon">
                      <FaFileAlt className="input-icon" />
                      <textarea
                        id="diagnosis"
                        rows={4}
                        placeholder="Diagnóstico realizado por el veterinario..."
                        {...register('diagnosis')}
                      />
                    </div>
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="visit-subsection__form-column">
                  <div className="visit-subsection__field">
                    <label htmlFor="treatment">Tratamiento</label>
                    <div className="input-with-icon">
                      <FaFileAlt className="input-icon" />
                      <textarea
                        id="treatment"
                        rows={4}
                        placeholder="Tratamiento prescrito..."
                        {...register('treatment')}
                      />
                    </div>
                  </div>

                  <div className="visit-subsection__field">
                    <label htmlFor="followUpDate">Fecha de Seguimiento</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="followUpDate"
                        type="date"
                        {...register('followUpDate', {
                          validate: (value) => {
                            if (!value) return true; // Opcional
                            if (visitDateValue && value <= visitDateValue) {
                              return 'La fecha de seguimiento debe ser posterior a la fecha de visita';
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
                    <label htmlFor="followUpHour">Hora de Seguimiento</label>
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
              </div>

              {crudError && (
                <div className="server-error">
                  <p>Error: {crudError}</p>
                </div>
              )}

              <div className="visit-subsection__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  variant="primary"
                >
                  {editingVetVisit
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
        // context="visit"
        defaultTitle={`Próxima visita veterinaria - ${pet.name}`}
        defaultDescription="Recordatorio para visita veterinaria"
      />

      {/* Sección 3: Historial de Visitas Veterinarias */}
      <div className="pet-section-card pet-section-card--visit-history">
        <div className="visit-subsection__history-header">
          <div>
            <FaStethoscope className="history-icon" />
            <h3>Historial de Visitas Veterinarias</h3>
          </div>
          <p>Registro completo de todas las visitas veterinarias</p>
        </div>

        {crudError && (
          <div className="server-error">
            <p>Error: {crudError}</p>
          </div>
        )}

        {loading && vetVisits.length === 0 ? (
          <p className="visit-subsection__loading">
            Cargando visitas veterinarias...
          </p>
        ) : vetVisits.length === 0 ? (
          <p className="visit-subsection__empty">
            No hay visitas veterinarias registradas aún
          </p>
        ) : (
          <div className="visit-subsection__visits-list">
            {vetVisits.map((vetVisit) => (
              <div
                key={vetVisit.id}
                className="visit-subsection__visit-card"
              >
                <div className="visit-card__header">
                  <div className="visit-card__title">
                    <FaStethoscope className="visit-icon" />
                    <h4>{vetVisit.reason || 'Visita veterinaria'}</h4>
                  </div>
                  <div className="visit-card__actions">
                    <button
                      className="visit-card__action-btn"
                      onClick={() => handleEditClick(vetVisit)}
                      aria-label="Editar visita"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="visit-card__action-btn visit-card__action-btn--delete"
                      onClick={() => handleDeleteClick(vetVisit)}
                      aria-label="Eliminar visita"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="visit-card__details">
                  <div className="visit-card__detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <label>Fecha de Visita</label>
                      <p>{formatDateTimeLocal(vetVisit.visitDate)}</p>
                    </div>
                  </div>

                  {vetVisit.followUpDate && (
                    <div className="visit-card__detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <label>Fecha de Seguimiento</label>
                        <p>{formatDateTimeLocal(vetVisit.followUpDate)}</p>
                      </div>
                    </div>
                  )}

                  {vetVisit.veterinarian && (
                    <div className="visit-card__detail-item">
                      <FaUserMd className="detail-icon" />
                      <div>
                        <label>Veterinario</label>
                        <p>{vetVisit.veterinarian}</p>
                      </div>
                    </div>
                  )}

                  {vetVisit.diagnosis && (
                    <div className="visit-card__detail-item">
                      <label>Diagnóstico</label>
                      <p>{vetVisit.diagnosis}</p>
                    </div>
                  )}

                  {vetVisit.treatment && (
                    <div className="visit-card__detail-item">
                      <label>Tratamiento</label>
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
