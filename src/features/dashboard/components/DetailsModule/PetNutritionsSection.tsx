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

interface PetNutritionSectionProps {
  pet: Pet;
}

export const PetNutritionSection: React.FC<PetNutritionSectionProps> = ({
  pet,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const { openModal } = useModalStore();

  const { meals, loading, addMeal, updateMeal, removeMeal } = useMeals(pet.id);

  // Agrupar comidas
  const mealsByDay = meals.reduce(
    (acc, meal) => {
      const day = new Date(meal.mealTime).toLocaleDateString('es-AR', {
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
    const mealDescription = meal.description || 'esta comida';
    openModal({
      title: `¿Estás seguro que quieres eliminar "${mealDescription}"?`,
      content: 'Esta acción no se puede deshacer',
      variant: 'confirm',
      onConfirm: () => {
        removeMeal(meal.id);
      },
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
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
            <h3>Registro de Comida</h3>
            <p>Gestiona el historial de alimentación de {pet.name}</p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              onClick={handleAddClick}
              style={{ fontSize: '1.2rem' }}
            >
              <FaPlus style={{ marginRight: '4px' }} /> Agregar Comida
            </Button>
          )}
        </div>

        {showForm && (
          <div className="nutrition-subsection__form-section">
            <h4>{editingMeal ? 'Editar Comida' : 'Registrar Nueva Comida'}</h4>
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
        defaultTitle={`Recordatorio de alimentación - ${pet.name}`}
        defaultDescription="Recordatorio para dar de comer"
      />

      {/* Sección 3: Historial de Comidas */}
      <div className="pet-section-card pet-section-card--nutrition-history">
        <div className="nutrition-subsection__history-header">
          <div>
            <LuUtensilsCrossed className="history-icon" size={20} />
            <h3>Historial de Comidas</h3>
          </div>
          <p>Registro completo de todas las comidas registradas</p>
        </div>

        {loading && meals.length === 0 ? (
          <Loader text="Cargando comidas..." />
        ) : meals.length === 0 ? (
          <p className="nutrition-subsection__empty">
            No hay comidas registradas aún
          </p>
        ) : (
          <div className="nutrition-subsection__meals-list">
            {Object.entries(mealsByDay).map(([dayLabel, dayMeals]) => (
              <div key={dayLabel} className="nutrition-subsection__day-group">
                <div className="day-group__header">
                  <span className="day-group__title">{dayLabel}</span>
                  <span className="day-group__count">
                    {dayMeals.length} comida(s)
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
                            {meal.description
                              ? meal.description.split(' - ')[0] || 'Comida'
                              : 'Comida'}
                          </h4>
                        </div>
                        <div className="meal-card__actions">
                          <button
                            className="meal-card__action-btn"
                            onClick={() => handleEditClick(meal)}
                            aria-label="Editar comida"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="meal-card__action-btn meal-card__action-btn--delete"
                            onClick={() => handleDeleteClick(meal)}
                            aria-label="Eliminar comida"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="meal-card__details">
                        <div className="meal-card__detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div>
                            <label>Fecha y Hora</label>
                            <p>{formatDateLocal(meal.mealTime)}</p>
                          </div>
                        </div>

                        {meal.description && meal.description.trim() !== '' && (
                          <div className="meal-card__detail-item">
                            <label>Descripción</label>
                            <p>{meal.description}</p>
                          </div>
                        )}

                        {meal.calories && (
                          <div className="meal-card__detail-item">
                            <label>Calorías</label>
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
