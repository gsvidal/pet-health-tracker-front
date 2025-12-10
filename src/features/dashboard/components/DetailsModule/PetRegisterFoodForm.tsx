import React from 'react';
import { Controller } from 'react-hook-form';
import type { Pet } from '../../../../models/pet.model';
import { useMealForm } from '../../../../hooks/useMealForm';
import { Button } from '../../../../components/Button/Button';
import { Select } from '../../../../components/Select';
import { FaCalendarAlt, FaClock, FaUtensils, FaFileAlt } from 'react-icons/fa';

import type { Meal } from '../../../../models/meal.model';

interface PetRegisterFoodFormProps {
  pet: Pet;
  editingMeal?: Meal | null;
  onClose: () => void;
  onFoodAdded: (data: any) => Promise<void>;
}

export const PetRegisterFoodForm: React.FC<PetRegisterFoodFormProps> = ({
  pet,
  editingMeal,
  onClose,
  onFoodAdded,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    control,
  } = useMealForm({
    petId: pet.id || '',
    editingMeal,
    onSave: async (data) => {
      await onFoodAdded(data);
    },
    onSuccess: () => {
      onClose();
    },
  });

  const handleCancelForm = () => {
    handleCancel();
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="nutrition-subsection__form"
    >
      <div className="nutrition-subsection__form-grid">
        {/* Columna Izquierda */}
        <div className="nutrition-subsection__form-column">
          <div className="nutrition-subsection__field">
            <label htmlFor="date">
              Fecha <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <FaCalendarAlt className="input-icon" />
              <input
                id="date"
                type="date"
                {...register('date', {
                  required: 'La fecha es obligatoria',
                })}
                className={errors.date ? 'input-error' : ''}
              />
            </div>
            {errors.date && (
              <span className="error-message">{errors.date.message}</span>
            )}
          </div>

          <div className="nutrition-subsection__field">
            <label htmlFor="time">
              Hora <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <FaClock className="input-icon" />
              <input
                id="time"
                type="time"
                {...register('time', {
                  required: 'La hora es obligatoria',
                })}
                className={errors.time ? 'input-error' : ''}
              />
            </div>
            {errors.time && (
              <span className="error-message">{errors.time.message}</span>
            )}
          </div>

          <div className="nutrition-subsection__field">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  label="Tipo de Comida"
                  value={field.value || null}
                  onChange={(value) => field.onChange(value || '')}
                  options={[
                    { value: 'Desayuno', label: 'Desayuno' },
                    { value: 'Almuerzo', label: 'Almuerzo' },
                    { value: 'Cena', label: 'Cena' },
                    { value: 'Snack', label: 'Snack' },
                  ]}
                  placeholder="Selecciona el tipo de comida"
                />
              )}
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="nutrition-subsection__form-column">
          <div className="nutrition-subsection__field">
            <label htmlFor="food">Alimento</label>
            <div className="input-with-icon">
              <FaUtensils className="input-icon" />
              <input
                id="food"
                type="text"
                placeholder="Ej: Croquetas Premium, Pavo, Carne..."
                {...register('food', {
                  maxLength: {
                    value: 200,
                    message: 'El alimento no puede exceder 200 caracteres',
                  },
                })}
                className={errors.food ? 'input-error' : ''}
              />
            </div>
            {errors.food && (
              <span className="error-message">{errors.food.message}</span>
            )}
          </div>

          <div className="nutrition-subsection__field">
            <label htmlFor="quantity">Cantidad</label>
            <input
              id="quantity"
              type="text"
              placeholder="Ej: 200g, 1 taza..."
              {...register('quantity', {
                maxLength: {
                  value: 100,
                  message: 'La cantidad no puede exceder 100 caracteres',
                },
              })}
              className={errors.quantity ? 'input-error' : ''}
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity.message}</span>
            )}
          </div>

          <div className="nutrition-subsection__field">
            <label htmlFor="notes">Notas (opcional)</label>
            <div className="input-with-icon">
              <FaFileAlt className="input-icon" />
              <textarea
                id="notes"
                rows={4}
                placeholder="Observaciones sobre esta comida..."
                {...register('notes')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="nutrition-subsection__form-actions">
        <Button type="submit" disabled={!isValid} variant="primary">
          {editingMeal ? 'Actualizar Registro' : 'Guardar Registro'}
        </Button>
        <Button type="button" onClick={handleCancelForm} variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
};
