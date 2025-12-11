import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import type { Pet } from '../../../../models/pet.model';
import { usePetStore } from '../../../../store/pet.store';
import { usePetForm } from '../../../../hooks/usePetForm';
import { Button } from '../../../../components/Button/Button';
import { Select } from '../../../../components/Select';
import { FaRegEdit, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { FileText } from 'lucide-react';
import { useDocumentModalStore } from '../../../../store/documentModal.store';
import './PetInfoSection.scss';

interface PetInfoSectionProps {
  pet: Pet;
}

export default function PetInfoSection({ pet }: PetInfoSectionProps) {
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
            <h3>Información General</h3>
            <p>Detalles completos de tu mascota</p>
          </div>
          {!isEditing && (
            <div className="pet-info-subsection__header-actions">
              <Button
                variant="outline"
                onClick={() => openDocumentUpload(pet.id)}
              >
                <FileText size={18} style={{ marginRight: '0.5rem' }} />
                <span>Subir documentos</span>
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
                  <span>Ver documentos ({documents.length})</span>
                </Button>
              )}
              <Button variant="primary" onClick={handleEditClick}>
                <FaRegEdit style={{ marginRight: '4px' }} size={12} />{' '}
                <span style={{ fontSize: '1.2rem' }}>Editar Información</span>
              </Button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="pet-info-subsection__form-section">
            <h4>Editar Información de la Mascota</h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="pet-info-subsection__form"
            >
              <div className="pet-info-subsection__form-grid">
                {/* Columna Izquierda */}
                <div className="pet-info-subsection__form-column">
                  <div className="pet-info-subsection__field">
                    <label htmlFor="name">Nombre</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Ej: Max, Luna..."
                      {...register('name', {
                        maxLength: {
                          value: 100,
                          message: 'El nombre no puede exceder 100 caracteres',
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
                    <label htmlFor="species">Especie</label>
                    <input
                      id="species"
                      type="text"
                      placeholder="Ej: Perro, Gato..."
                      {...register('species', {
                        maxLength: {
                          value: 50,
                          message: 'La especie no puede exceder 50 caracteres',
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
                    <label htmlFor="breed">Raza</label>
                    <input
                      id="breed"
                      type="text"
                      placeholder="Ej: Labrador, Persa..."
                      {...register('breed', {
                        maxLength: {
                          value: 100,
                          message: 'La raza no puede exceder 100 caracteres',
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
                    <label htmlFor="birthDate">Fecha de Nacimiento</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        id="birthDate"
                        type="date"
                        {...register('birthDate', {
                          validate: (value) => {
                            if (!value) return true; // Opcional
                            if (isNaN(Date.parse(value))) {
                              return 'La fecha no es válida';
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
                    <label htmlFor="weightKg">Peso (kg)</label>
                    <input
                      id="weightKg"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ej: 15.5"
                      {...register('weightKg', {
                        validate: (value) => {
                          if (!value) return true; // Opcional
                          const num = Number(value);
                          if (isNaN(num) || num < 0 || num > 999.99) {
                            return 'El peso debe ser un número entre 0 y 999.99';
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
                          message: 'El sexo no puede exceder 20 caracteres',
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <Select
                            label="Sexo"
                            value={field.value || null}
                            onChange={(value) => field.onChange(value || '')}
                            options={[
                              { value: 'Macho', label: 'Macho' },
                              { value: 'Hembra', label: 'Hembra' },
                            ]}
                            placeholder="Seleccione..."
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
                    <label htmlFor="photoUrl">URL de Foto</label>
                    <input
                      id="photoUrl"
                      type="url"
                      placeholder="https://ejemplo.com/foto-mascota.jpg"
                      {...register('photoUrl')}
                      className={errors.photoUrl ? 'input-error' : ''}
                    />
                    {errors.photoUrl && (
                      <span className="error-message">
                        {errors.photoUrl.message}
                      </span>
                    )}
                    <small style={{ color: '#666', fontSize: '0.85rem' }}>
                      Opcional: Agrega foto de tu mascota
                    </small>
                  </div>

                  <div className="pet-info-subsection__field">
                    <label htmlFor="notes">Notas</label>
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

              {error && (
                <div className="server-error">
                  <p>Error: {error}</p>
                </div>
              )}

              <div className="pet-info-subsection__form-actions">
                <Button
                  type="submit"
                  disabled={loading || !isValid || !isDirty}
                  variant="primary"
                >
                  Actualizar Registro
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

        {!isEditing && (
          <div className="pet-info-subsection__info-grid">
            <div className="info-item">
              <label>Nombre</label>
              <p>{pet.name}</p>
            </div>
            <div className="info-item">
              <label>Especie</label>
              <p>{pet.species}</p>
            </div>
            <div className="info-item">
              <label>Raza</label>
              <p>{pet.breed || '—'}</p>
            </div>
            <div className="info-item">
              <label>Fecha de Nacimiento</label>
              <p>{pet.birthDate ? pet.birthDate.split('T')[0] : '—'}</p>
            </div>
            <div className="info-item">
              <label>Edad</label>
              <p>
                {pet.ageYears
                  ? pet.ageYears === 1
                    ? '1 año'
                    : `${pet.ageYears} años`
                  : '—'}
              </p>
            </div>
            <div className="info-item">
              <label>Peso</label>
              <p>{pet.weightKg ? `${pet.weightKg} kg` : '—'}</p>
            </div>
            <div className="info-item">
              <label>Sexo</label>
              <p>{pet.sex || '—'}</p>
            </div>
            {pet.photoUrl && (
              <div className="info-item">
                <label>Foto</label>
                <p>
                  <a
                    href={pet.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver foto
                  </a>
                </p>
              </div>
            )}
            {pet.notes && (
              <div className="info-item info-item--full">
                <label>Notas</label>
                <p>{pet.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
