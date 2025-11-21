import './PetFormPage.scss';
import React, { useState } from 'react';
import { Heart, Upload, X } from 'lucide-react';
import { usePetStore } from '../../../../store/pet.store';
import { useNavigate } from 'react-router-dom';
import type {
  PetFormData,
  PetFormState,
} from '../../../../adapters/pet.adapter';

export function CreatePetForm() {
  const navigate = useNavigate();
  const { createPet, loading  } = usePetStore();
  const [formData, setFormData] = useState<PetFormState>({
    name: '',
    species: '',
    breed: '',
    sex: '',
    birthDate: '',
    ageYears: '',
    weightKg: '',
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

    // Convertir PetFormState (strings) a PetFormData (null para vacíos, number para numéricos)
    const payload: PetFormData = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed || null,
      birthDate: formData.birthDate || null,
      ageYears: formData.ageYears ? Number(formData.ageYears) : null,
      weightKg: formData.weightKg || null,
      sex: formData.sex || null,
      photoUrl: formData.photoUrl || null,
      notes: formData.notes || null,
    };

    await createPet(payload);
    // Si fue exitoso, el store ya muestra el toast
    // Si hubo error, el store ya lo maneja con toast
    // No necesitamos try/catch porque callApi no lanza excepciones
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
            <div className="field">
              <label>
                Especie <span className="required">*</span>
              </label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una especie</option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="ave">Ave</option>
                <option value="conejo">Conejo</option>
                <option value="hamster">Hamster</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="field">
              <label>
                Raza <span className="required">*</span>
              </label>
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
            <label>
              Sexo <span className="required">*</span>
            </label>
            <select name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>
        </div>

        {/* Detalles Físicos */}
        <div className="section">
          <h3>Detalles Físicos</h3>

          <div className="field-row">
            <div className="field">
              <label>
                Fecha de Nacimiento <span className="required">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>
                Edad (años) <span className="required">*</span>
              </label>
              <input
                type="text"
                name="ageYears"
                placeholder="Ej: 3"
                value={formData.ageYears}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>
              Peso (kg) <span className="required">*</span>
            </label>
            <input
              type="text"
              name="weightKg"
              placeholder="Ej: 28.5"
              value={formData.weightKg}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Información Adicional */}
        <div className="section">
          <h3>Información Adicional</h3>

          <div className="field">
            <label>URL de Foto</label>
            <div className="input-group">
              <input
                type="text"
                name="photoUrl"
                placeholder="https://ejemplo.com/foto-mascota.jpg"
                value={formData.photoUrl}
                onChange={handleChange}
              />
              <button type="button" className="icon-btn">
                <Upload size={16} />
              </button>
            </div>
          </div>

          <div className="field">
            <label>Notas</label>
            <textarea
              name="notes"
              placeholder="Información adicional sobre tu mascota"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            <Heart size={18} fill="white" />
            {loading ? 'Creando...' : 'Crear Mascota'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/dashboard')}
          >
            <X size={18} />
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
