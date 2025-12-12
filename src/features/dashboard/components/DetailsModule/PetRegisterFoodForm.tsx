import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
              {t('nutrition.date')} <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <FaCalendarAlt className="input-icon" />
              <input
                id="date"
                type="date"
                {...register('date', {
                  required: t('nutrition.dateRequired'),
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
              {t('nutrition.time')} <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <FaClock className="input-icon" />
              <input
                id="time"
                type="time"
                {...register('time', {
                  required: t('nutrition.timeRequired'),
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
              render={({ field }) => {
                // Opciones con valores del backend (español) pero labels traducidos
                const mealTypeOptions = [
                  { value: 'Desayuno', label: t('nutrition.breakfast') },
                  { value: 'Almuerzo', label: t('nutrition.lunch') },
                  { value: 'Cena', label: t('nutrition.dinner') },
                  { value: 'Snack', label: t('nutrition.snack') },
                ];

                return (
                  <Select
                    label={t('nutrition.type')}
                    value={field.value || null}
                    onChange={(value) => {
                      // El valor se guarda tal cual (en español para el backend)
                      field.onChange(value || '');
                    }}
                    options={mealTypeOptions}
                    placeholder={t('nutrition.typePlaceholder')}
                  />
                );
              }}
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="nutrition-subsection__form-column">
          <div className="nutrition-subsection__field">
            <label htmlFor="food">{t('nutrition.food')}</label>
            <div className="input-with-icon">
              <FaUtensils className="input-icon" />
              <input
                id="food"
                type="text"
                placeholder={t('nutrition.foodPlaceholder')}
                {...register('food', {
                  maxLength: {
                    value: 200,
                    message: t('nutrition.foodMaxLength'),
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
            <label htmlFor="quantity">{t('nutrition.quantity')}</label>
            <input
              id="quantity"
              type="text"
              placeholder={t('nutrition.quantityPlaceholder')}
              {...register('quantity', {
                maxLength: {
                  value: 100,
                  message: t('nutrition.quantityMaxLength'),
                },
              })}
              className={errors.quantity ? 'input-error' : ''}
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity.message}</span>
            )}
          </div>

          <div className="nutrition-subsection__field">
            <label htmlFor="notes">{t('nutrition.notes')}</label>
            <div className="input-with-icon">
              <FaFileAlt className="input-icon" />
              <textarea
                id="notes"
                rows={4}
                placeholder={t('nutrition.notesPlaceholder')}
                {...register('notes')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="nutrition-subsection__form-actions">
        <Button type="submit" disabled={!isValid} variant="primary">
          {editingMeal ? t('common.update') : t('common.save')}
        </Button>
        <Button type="button" onClick={handleCancelForm} variant="outline">
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
};
