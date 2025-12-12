import { useTranslation } from 'react-i18next';
import type { Pet } from '../../../../models/pet.model';
import './PetNutritionSection.scss';
import { FaPlus } from 'react-icons/fa6';
import { PetRegisterFoodForm } from './PetRegisterFoodForm';
import { RemindersSection } from './RemindersSection/RemindersSection';
import { useState } from 'react';
import { useMeals } from '../../../../hooks/useMeal';
import { LuUtensilsCrossed } from 'react-icons/lu';
import { FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { Button } from '../../../../components/Button/Button';
import { Loader } from '../../../../components/Loader/Loader';
import { useModalStore } from '../../../../store/modal.store';
import type { Meal } from '../../../../models/meal.model';
import { formatDateLocal } from '../../../../utils/dateUtils';
import { parseMealType, parseMealName } from '../../../../utils/mealUtils';
import i18n from '../../../../i18n/config';

interface PetNutritionSectionProps {
  pet: Pet;
}

export const PetNutritionSection: React.FC<PetNutritionSectionProps> = ({
  pet,
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const { openModal } = useModalStore();

  const { meals, loading, addMeal, updateMeal, removeMeal } = useMeals(pet.id);

  // Agrupar comidas
  const mealsByDay = meals.reduce(
    (acc, meal) => {
      const locale = i18n.language === 'en' ? 'en-US' : 'es-AR';
      const day = new Date(meal.mealTime).toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      if (!acc[day]) acc[day] = [];
      acc[day].push(meal);
      return acc;
    },
    {} as Record<string, typeof meals>,
  );

  const handleAddClick = () => {
    setEditingMeal(null);
    setShowForm(true);
  };

  const handleEditClick = (meal: Meal) => {
    setEditingMeal(meal);
    setShowForm(true);
  };

  const handleDeleteClick = (meal: Meal) => {
    const mealDescription = meal.description || t('common.thisItem');
    openModal({
      title: `${t('modals.delete.title')} "${mealDescription}"?`,
      content: t('modals.delete.content'),
      variant: 'confirm',
      onConfirm: () => {
        removeMeal(meal.id);
      },
      confirmLabel: t('common.delete'),
      cancelLabel: t('common.cancel'),
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMeal(null);
  };

  return (
    <div className="nutrition-subsection">
      {/* Sección 1: Registro de Comida */}
      <div className="pet-section-card pet-section-card--nutrition">
        <div className="nutrition-subsection__header">
          <div className="nutrition-subsection__title">
            <h3>{t('nutrition.title')}</h3>
            <p>{t('nutrition.manageHistory', { petName: pet.name })}</p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              onClick={handleAddClick}
              style={{ fontSize: '1.2rem' }}
            >
              <FaPlus style={{ marginRight: '4px' }} /> {t('nutrition.add')}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="nutrition-subsection__form-section">
            <h4>
              {editingMeal ? t('nutrition.edit') : t('nutrition.registerNew')}
            </h4>
            <PetRegisterFoodForm
              pet={pet}
              editingMeal={editingMeal}
              onClose={handleCancelForm}
              onFoodAdded={async (mealInput) => {
                if (editingMeal) {
                  await updateMeal(editingMeal.id, mealInput);
                } else {
                  await addMeal(mealInput);
                }
                setShowForm(false);
                setEditingMeal(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Sección 2: Recordatorios */}
      <RemindersSection
        petId={pet.id || null}
        defaultTitle={t('nutrition.nextReminder', { petName: pet.name })}
        defaultDescription={t('nutrition.reminderDescription')}
      />

      {/* Sección 3: Historial de Comidas */}
      <div className="pet-section-card pet-section-card--nutrition-history">
        <div className="nutrition-subsection__history-header">
          <div>
            <LuUtensilsCrossed className="history-icon" size={20} />
            <h3>{t('nutrition.history')}</h3>
          </div>
          <p>{t('nutrition.historyDescription')}</p>
        </div>

        {loading && meals.length === 0 ? (
          <Loader text={t('nutrition.loading')} />
        ) : meals.length === 0 ? (
          <p className="nutrition-subsection__empty">{t('nutrition.empty')}</p>
        ) : (
          <div className="nutrition-subsection__meals-list">
            {Object.entries(mealsByDay).map(([dayLabel, dayMeals]) => (
              <div key={dayLabel} className="nutrition-subsection__day-group">
                <div className="day-group__header">
                  <span className="day-group__title">{dayLabel}</span>
                  <span className="day-group__count">
                    {t('nutrition.mealsCount', { count: dayMeals.length })}
                  </span>
                </div>

                <div className="day-group__meals">
                  {dayMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="nutrition-subsection__meal-card"
                    >
                      <div className="meal-card__header">
                        <div className="meal-card__title">
                          <LuUtensilsCrossed className="meal-icon" />
                          <h4>
                            {(() => {
                              const mealType = parseMealType(meal.description);
                              const mealName = parseMealName(meal.description);
                              // Si hay tipo traducido, mostrarlo; si no, mostrar el nombre parseado o el default
                              return (
                                mealType ||
                                mealName ||
                                t('nutrition.defaultMeal')
                              );
                            })()}
                          </h4>
                        </div>
                        <div className="meal-card__actions">
                          <button
                            className="meal-card__action-btn"
                            onClick={() => handleEditClick(meal)}
                            aria-label={t('common.edit')}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="meal-card__action-btn meal-card__action-btn--delete"
                            onClick={() => handleDeleteClick(meal)}
                            aria-label={t('common.delete')}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="meal-card__details">
                        <div className="meal-card__detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div>
                            <label>{t('nutrition.dateTime')}</label>
                            <p>{formatDateLocal(meal.mealTime)}</p>
                          </div>
                        </div>

                        {meal.description && meal.description.trim() !== '' && (
                          <div className="meal-card__detail-item">
                            <label>{t('common.description')}</label>
                            <p>
                              {parseMealName(meal.description) ||
                                meal.description}
                            </p>
                          </div>
                        )}

                        {meal.calories && (
                          <div className="meal-card__detail-item">
                            <label>{t('nutrition.calories')}</label>
                            <p>{meal.calories} kcal</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
