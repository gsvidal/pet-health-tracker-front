import { useState } from 'react';
import type { Pet } from '../../../../models/pet.model';
import { usePetStore } from '../../../../store/pet.store';
import './PetInfoSection.scss';
import { FaRegEdit, FaRegSave } from 'react-icons/fa';

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

  return (
    <div className="pet-section-card pet-section-card--info">
      <div className="information-header">
        <div className="general-information">
          <h3>Información General</h3>
          <p>Detalles completos de tu mascota</p>
        </div>
        <div className="edit-btn">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              <p id="general-title">
                <FaRegEdit className="icon-general" size={15} />
                Editar
              </p>
            </button>
          ) : (
            <button id="save-button" onClick={handleSave}>
              <p id="save-title">
                <FaRegSave className="icon-general" size={15} />
                Guardar
              </p>
            </button>
          )}
        </div>
      </div>

      <div className="info-grid">
        <div>
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

        <div>
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

        <div>
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

        <div>
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

        <div>
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

        <div>
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

        <div>
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
            </>
          ) : (
            <p>{pet.sex || '—'}</p>
          )}
        </div>

        <div>
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
      </div>

      <div className="notes">
        <label>Notas</label>
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
  );
}
