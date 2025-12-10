import './PetFormPage.scss';
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { usePetStore } from '../../../../store/pet.store';
import type {
  PetFormData,
  PetFormState,
} from '../../../../adapters/pet.adapter';
import { Button } from '../../../../components/Button/Button';
import { Select } from '../../../../components/Select';

export function CreatePetForm() {
  const { createPet, loading } = usePetStore();

  const [formData, setFormData] = useState<PetFormState>({
    name: '',
    species: '',
    breed: '',
    sex: '',
    birthDate: '',
    ageYears: '',
    weightKg: '0.0',
    photoUrl: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: PetFormData = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed || null,
      birthDate: formData.birthDate || null,
      ageYears: formData.ageYears ? Number(formData.ageYears) : null,
      weightKg: formData.weightKg,
      sex: formData.sex || null,
      photoUrl: formData.photoUrl || null,
      notes: formData.notes || null,
    };

    await createPet(payload);
    // El store maneja errores y toasts
  };

  return (
    <form className="create-pet-container" onSubmit={handleSubmit}>
      <div className="create-pet-card">
        {/* Header */}
        <div className="card-header">
          <div className="header-icon">
            <Heart fill="white" size={24} />
          </div>
          <div>
            <h2>Crear Nueva Mascota</h2>
            <p>
              Completa la información de tu mascota para comenzar a gestionar su
              salud
            </p>
          </div>
        </div>

        {/* Información Básica */}
        <div className="section">
          <h3>Información Básica</h3>

          {/* Nombre obligatorio */}
          <div className="field">
            <label>
              Nombre de la Mascota <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Max, Luna, Rocky..."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-row">
            {/* Especie obligatoria */}
            <div className="field">
              <Select
                label="Especie"
                value={formData.species || null}
                onChange={(value) =>
                  setFormData({ ...formData, species: value || '' })
                }
                options={[
                  { value: 'perro', label: 'Perro' },
                  { value: 'gato', label: 'Gato' },
                  { value: 'ave', label: 'Ave' },
                  { value: 'conejo', label: 'Conejo' },
                  { value: 'hamster', label: 'Hamster' },
                  { value: 'otro', label: 'Otro' },
                ]}
                placeholder="Selecciona una especie"
              />
            </div>

            {/* Raza */}
            <div className="field">
              <label>Raza</label>
              <input
                type="text"
                name="breed"
                placeholder="Ej: Golden Retriever, Siamés..."
                value={formData.breed}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <Select
              label="Sexo"
              value={formData.sex || null}
              onChange={(value) =>
                setFormData({ ...formData, sex: value || '' })
              }
              options={[
                { value: 'macho', label: 'Macho' },
                { value: 'hembra', label: 'Hembra' },
              ]}
              placeholder="Selecciona una opción"
            />
          </div>
        </div>

        {/* Detalles Físicos */}
        <div className="section">
          <h3>Detalles Físicos</h3>

          <div className="field-row">
            <div className="field">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Edad (años)</label>
              <input
                type="number"
                name="ageYears"
                placeholder="Ej: 3"
                value={formData.ageYears}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Peso (kg)</label>
            <input
              type="number"
              name="weightKg"
              placeholder="Ej: 28.5"
              value={formData.weightKg}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="section">
          {/* <h3>Información Adicional</h3> */}

          {/* <div className="field">
            <label>URL de Foto</label>
            <div className="input-group">
              <input
                type="file"
                name="photoUrl"
                placeholder="https://ejemplo.com/foto.jpg"
                value={formData.photoUrl}
                onChange={handleChange}
              />
              <button type="button" className="icon-btn">
                <Upload size={16} />
              </button>
            </div>
          </div>
 */}
          <div className="field">
            <label>Notas</label>
            <textarea
              name="notes"
              placeholder="Información adicional sobre tu mascota"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="actions">
          <Button type="submit" disabled={loading}>
            <Heart size={18} fill="white" />
            {loading ? 'Creando...' : 'Crear Mascota'}
          </Button>
        </div>
      </div>
    </form>
  );
}
