import { useState } from 'react';
import type { Pet } from '../../../../models/pet.model';
import { usePetStore } from '../../../../store/pet.store';
import './PetInfoSection.scss';
import { FaRegEdit, FaCheck } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

interface PetInfoSectionProps {
  pet: Pet;
}
interface ErrorState {
  name: string;
  species: string;
  birthDate: string;
  weightKg: string;
  sex: string;
  breed: string;
  ageYears: string;
  healthStatus: string;
  photoUrl: string;
  notes: string;
}

export default function PetInfoSection({ pet }: PetInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updatePet = usePetStore((s) => s.updatePet);
  const [errors, setErrors] = useState<ErrorState>({
    name: '',
    species: '',
    birthDate: '',
    weightKg: '',
    sex: '',
    breed: '',
    ageYears: '',
    healthStatus: '',
    photoUrl: '',
    notes: '',
  });

  const validate = () => {
    const newErrors: Partial<ErrorState> = {};
    if (!formData.name.trim()) {
      newErrors.name = '* Debe ingresar nombre';
    }
    if (!formData.species.trim()) {
      newErrors.species = '* Debe ingresar especie';
    }
    if (!formData.birthDate.trim()) {
      newErrors.birthDate = '* Debe ingresar fecha de nacimiento';
    } else if (isNaN(Date.parse(formData.birthDate))) {
      newErrors.birthDate = 'La fecha no es válida';
    }
    if (!formData.weightKg.trim()) {
      newErrors.weightKg = '* Debe ingresar peso';
    } else if (isNaN(Number(formData.weightKg))) {
      newErrors.weightKg = 'El peso debe ser un número';
    }
    if (!formData.sex) {
      newErrors.sex = 'Debe seleccionar un sexo';
    }
    if (!formData.breed.trim()) {
      newErrors.breed = '* Debe ingresar raza';
    }
    if (!formData.ageYears.trim()) {
      newErrors.ageYears = '* Debe ingresar edad';
    } else if (isNaN(Number(formData.ageYears))) {
      newErrors.ageYears = 'La edad debe ser un número';
    }
    if (!formData.healthStatus.trim()) {
      newErrors.healthStatus = '* Debe ingresar salud';
    }
    if (!formData.notes.trim()) {
      newErrors.notes = '* Debe ingresar nota';
    }
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const [formData, setFormData] = useState({
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? '',
    birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : '',
    ageYears: pet.ageYears ? String(pet.ageYears) : '',
    weightKg: String(pet.weightKg ?? ''),
    sex: pet.sex ?? '',
    healthStatus: pet.healthStatus ?? '',
    photoUrl: pet.photoUrl ?? '',
    notes: pet.notes ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'weightKg' ? String(value) : value,
    });
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!validate()) return;
    await updatePet(pet.id, {
      ...formData,
      ageYears: Number(formData.ageYears),
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed ?? '',
      birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : '',
      ageYears: pet.ageYears ? String(pet.ageYears) : '',
      weightKg: String(pet.weightKg ?? ''),
      sex: pet.sex ?? '',
      healthStatus: pet.healthStatus ?? '',
      photoUrl: pet.photoUrl ?? '',
      notes: pet.notes ?? '',
    });

    setErrors({
      name: '',
      species: '',
      birthDate: '',
      weightKg: '',
      sex: '',
      breed: '',
      ageYears: '',
      healthStatus: '',
      photoUrl: '',
      notes: '',
    });

    setIsEditing(false);
  };

  return (
    <div
      className={`pet-section-card pet-section-card--info ${isEditing ? 'editing' : ''}`}
    >
      <div className="information-header">
        <div className="general-information">
          <h3>Información General</h3>
          <p>Detalles completos de tu mascota</p>
        </div>
      </div>
      {isEditing && <p id="text-basics">Informacion Básica</p>}
      <div className="info-grid">
        <div className="name-container">
          <label>Nombre</label>
          {isEditing ? (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <p id="error-details">{errors.name}</p>}
            </>
          ) : (
            <p>{pet.name}</p>
          )}
        </div>

        <div className="species-container">
          <label>Especie</label>
          {isEditing ? (
            <>
              <input
                name="species"
                value={formData.species}
                onChange={handleChange}
                className={errors.species ? 'input-error' : ''}
              />
              {errors.species && <p id="error-details">{errors.species}</p>}
            </>
          ) : (
            <p>{pet.species}</p>
          )}
        </div>

        <div className="race-container">
          <label>Raza</label>
          {isEditing ? (
            <>
              <input
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className={errors.breed ? 'input-error' : ''}
              />
              {errors.breed && <p id="error-details">{errors.breed}</p>}
            </>
          ) : (
            <p>{pet.breed}</p>
          )}
        </div>

        <div className="date-container">
          <label>Fecha de nacimiento</label>
          {isEditing ? (
            <>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className={errors.birthDate ? 'input-error' : ''}
              />
              {errors.birthDate && <p id="error-details">{errors.birthDate}</p>}
            </>
          ) : (
            <p>{pet.birthDate}</p>
          )}
        </div>

        <div className="birth-container">
          <label>Edad</label>
          {isEditing ? (
            <>
              <input
                type="number"
                name="ageYears"
                value={formData.ageYears}
                onChange={handleChange}
                className={errors.ageYears ? 'input-error' : ''}
              />
              {errors.ageYears && <p id="error-details">{errors.ageYears}</p>}
            </>
          ) : (
            <p>{pet.ageYears}</p>
          )}
        </div>

        <div className="weight-container">
          <label>Peso</label>
          {isEditing ? (
            <>
              <input
                type="number"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleChange}
                className={errors.weightKg ? 'input-error' : ''}
              />
              {errors.weightKg && <p id="error-details">{errors.weightKg}</p>}
            </>
          ) : (
            <p>{pet.weightKg}</p>
          )}
        </div>

        <div className="sex-container">
          <label>Sexo</label>
          {isEditing ? (
            <>
              <select
                name="sex"
                value={formData.sex || ''}
                onChange={handleChange}
                className={errors.sex ? 'input-error' : ''}
              >
                <option value="">Seleccione...</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
              {errors.sex && <p id="error-details">{errors.sex}</p>}
              <p id="text-fisics">Detalles Físicos</p>
            </>
          ) : (
            <p>{pet.sex || '—'}</p>
          )}
        </div>

        <div className="health-container">
          <label>Estado de Salud</label>
          {isEditing ? (
            <>
              <input
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                className={errors.healthStatus ? 'input-error' : ''}
              />
              {errors.healthStatus && (
                <p id="error-details">{errors.healthStatus}</p>
              )}
            </>
          ) : (
            <p>{pet.healthStatus}</p>
          )}
        </div>

        {isEditing && (
          <div className="photo-container">
            <p id="text-aditional">Informacion Adicional</p>
            <label>URL de Foto</label>
            <input
              placeholder="https://ejemplo.com/foto-mascota.jpg"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className={errors.photoUrl ? 'input-error' : ''}
            />
            <p id="optional-text">* Opcional: Agrega foto de tu mascota</p>
            {errors.photoUrl && <p id="error-details">{errors.photoUrl}</p>}
          </div>
        )}

        <div className="notes">
          <label>Nota</label>
          {isEditing ? (
            <>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={errors.notes ? 'input-error' : ''}
              />
              {errors.notes && <p id="error-details">{errors.notes}</p>}
            </>
          ) : (
            <p>{pet.notes}</p>
          )}
        </div>
      </div>
      <div className="edit-btn">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>
            <p id="general-title">
              <FaRegEdit className="icon-general" size={15} />
              Editar Informacion
            </p>
          </button>
        ) : (
          <>
            <button id="save-button" onClick={handleSave}>
              <p id="save-title">
                <FaCheck className="icon-general" size={12} />
                Guardar
              </p>
            </button>
            <button id="cancel-button" onClick={handleCancel}>
              <p id="cancel-title">
                <IoCloseOutline className="icon-general" size={15} />
                Cancelar
              </p>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
