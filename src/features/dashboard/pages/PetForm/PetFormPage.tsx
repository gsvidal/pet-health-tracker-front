import './PetFormPage.scss';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { usePetStore } from '../../../../store/pet.store';
import type {
  PetFormData,
  PetFormState,
} from '../../../../adapters/pet.adapter';
import { Button } from '../../../../components/Button/Button';
import { Select } from '../../../../components/Select';

const initialFormState: PetFormState = {
  name: '',
  species: '',
  breed: '',
  sex: '',
  birthDate: '',
  weightKg: '0.0',
  photoUrl: '',
  notes: '',
};

export function CreatePetForm() {
  const { t } = useTranslation();
  const { createPet, loading } = usePetStore();

  const [formData, setFormData] = useState<PetFormState>(initialFormState);

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
      ageYears: null, // El backend calcula la edad automáticamente
      weightKg: formData.weightKg,
      sex: formData.sex || null,
      photoUrl: formData.photoUrl || null,
      notes: formData.notes || null,
    };

    try {
      await createPet(payload);
      // Limpiar formulario después de crear exitosamente
      setFormData(initialFormState);
    } catch (error) {
      // El store ya maneja errores y toasts
      // No limpiar el formulario si hay error
    }
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
            <h2>{t('pet.form.title')}</h2>
            <p>{t('pet.form.subtitle')}</p>
          </div>
        </div>

        {/* Información Básica */}
        <div className="section">
          <h3>{t('pet.form.basicInfo')}</h3>

          {/* Nombre obligatorio */}
          <div className="field">
            <label>
              {t('pet.form.name')}{' '}
              <span className="required">{t('common.required')}</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder={t('pet.form.namePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-row">
            {/* Especie obligatoria */}
            <div className="field">
              <Select
                label={t('pet.form.species')}
                value={formData.species || null}
                onChange={(value) =>
                  setFormData({ ...formData, species: value || '' })
                }
                options={[
                  { value: 'perro', label: t('pet.form.speciesOptions.perro') },
                  { value: 'gato', label: t('pet.form.speciesOptions.gato') },
                  { value: 'ave', label: t('pet.form.speciesOptions.ave') },
                  {
                    value: 'conejo',
                    label: t('pet.form.speciesOptions.conejo'),
                  },
                  {
                    value: 'hamster',
                    label: t('pet.form.speciesOptions.hamster'),
                  },
                  { value: 'otro', label: t('pet.form.speciesOptions.otro') },
                ]}
                placeholder={t('pet.form.speciesPlaceholder')}
              />
            </div>

            {/* Raza */}
            <div className="field">
              <label>{t('pet.form.breed')}</label>
              <input
                type="text"
                name="breed"
                placeholder={t('pet.form.breedPlaceholder')}
                value={formData.breed}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <Select
              label={t('pet.form.sex')}
              value={formData.sex || null}
              onChange={(value) =>
                setFormData({ ...formData, sex: value || '' })
              }
              options={[
                { value: 'Macho', label: t('pet.form.sexOptions.macho') },
                { value: 'Hembra', label: t('pet.form.sexOptions.hembra') },
              ]}
              placeholder={t('pet.form.sexPlaceholder')}
            />
          </div>
        </div>

        {/* Detalles Físicos */}
        <div className="section">
          <h3>{t('pet.form.physicalDetails')}</h3>

          <div className="field">
            <label>{t('pet.form.birthDate')}</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
            <small
              style={{
                color: '#666',
                fontSize: '0.85rem',
                display: 'block',
                marginTop: '0.25rem',
              }}
            >
              {t('pet.form.ageAutoCalculated')}
            </small>
          </div>

          <div className="field">
            <label>{t('pet.form.weight')}</label>
            <input
              type="number"
              name="weightKg"
              placeholder={t('pet.form.weightPlaceholder')}
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
            <label>{t('pet.form.notes')}</label>
            <textarea
              name="notes"
              placeholder={t('pet.form.notesPlaceholder')}
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
            {loading ? t('common.loading') : t('pet.form.submit')}
          </Button>
        </div>
      </div>
    </form>
  );
}
