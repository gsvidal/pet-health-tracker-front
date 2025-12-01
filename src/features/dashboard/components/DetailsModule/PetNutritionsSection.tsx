import type { Pet } from '../../../../models/pet.model';
import './PetNutritionSection.scss';
import { FaPlus } from 'react-icons/fa6';
import { PetRegisterFoodForm } from './PetRegisterFoodForm';
import { useState } from 'react';
import { useMeals } from '../../../../hooks/useMeal';
import { LuUtensilsCrossed } from 'react-icons/lu';
import { MdDeleteForever } from 'react-icons/md';

interface PetNutritionSectionProps {
  pet: Pet;
}
export const PetNutritionSection: React.FC<PetNutritionSectionProps> = ({
  pet,
}) => {
  const [showForm, setShowForm] = useState(false);
  const { meals, loading, addMeal, removeMeal } = useMeals(pet.id);
  // Agrupa las comidas por fecha (YYYY-MM-DD)
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

  return (
    <div className="nutrition-container">
      {/* ---- Título principal ---- */}
      <div className="nutrition-header">
        <div className="nutrition-header-top">
          <div>
            <h3>Seguimiento Nutricional</h3>
            <p>Controla la alimentación y dieta de {pet.name}</p>
          </div>

          <div className="register-food-btn">
            <button id="primary-reg-btn" onClick={() => setShowForm(!showForm)}>
              <p id="register-food-title">
                <FaPlus className="icon-reg-food" size={15} />
                Registrar Comida
              </p>
            </button>
          </div>
        </div>

        {/* --- Formulario Registro Comida --- */}
        <div className={`nutrition-form-wrapper ${showForm ? 'open' : ''}`}>
          {showForm && (
            <PetRegisterFoodForm
              pet={pet}
              onClose={() => setShowForm(false)}
              onFoodAdded={async (mealInput) => {
                await addMeal(mealInput);
                setShowForm(false);
              }}
            />
          )}
        </div>
      </div>

      {/* ---- Recordatorios ---- */}
      <div className="nutrition-card">
        <div className="section-title">
          <h4>Recordatorios de Alimentación</h4>
          <button className="secondary-btn">+ Nuevo Recordatorio</button>
        </div>

        <div className="reminder-list">
          {/* Ejemplo hardcodeado (luego lo conectamos al back) */}
          <div className="reminder-item">
            <div className="reminder-time">08:00</div>
            <div className="reminder-info">
              <span className="reminder-label">Desayuno</span>
              <p>Croquetas Premium - 200g</p>
            </div>
            <button className="delete-btn">✕</button>
          </div>

          <div className="reminder-item">
            <div className="reminder-time">14:00</div>
            <div className="reminder-info">
              <span className="reminder-label">Almuerzo</span>
              <p>Croquetas Premium - 200g</p>
            </div>
            <button className="delete-btn">✕</button>
          </div>

          <div className="reminder-item">
            <div className="reminder-time">20:00</div>
            <div className="reminder-info">
              <span className="reminder-label">Cena</span>
              <p>Croquetas Premium - 220g</p>
            </div>
            <button className="delete-btn">✕</button>
          </div>
        </div>
      </div>

      {/* ---- Historial ---- */}
      <div className="nutrition-card">
        <div className="section-title">
          <div>
            <h4>Historial de Comidas</h4>
          </div>
        </div>

        {loading && <p>Cargando...</p>}

        <div className="history-list">
          {meals.length === 0 ? (
            <p className="empty">No hay comidas registradas aún.</p>
          ) : (
            Object.entries(mealsByDay).map(([dayLabel, dayMeals]) => (
              <div key={dayLabel} className="history-day">
                {/* Encabezado del día */}
                <p>Registro completo ingresado</p>
                <div className="day-header">
                  <span className="day-title">{dayLabel}</span>
                  <span className="day-count">{dayMeals.length} comida(s)</span>
                </div>

                {/* Items del día */}
                {dayMeals.map((meal) => (
                  <div key={meal.id} className="history-item real">
                    <div className="history-avatar">
                      <LuUtensilsCrossed className="icon-tabs" size={15} />{' '}
                    </div>
                    <div className="history-info">
                      <div className="row">
                        <span className="time">
                          {new Date(meal.mealTime).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="meal-tag">{meal.description}</span>
                      </div>

                      <p className="food">{meal.description}</p>

                      {meal.calories && (
                        <p className="details">Cantidad: {meal.calories}g</p>
                      )}
                    </div>

                    <button id="delete-btn" onClick={() => removeMeal(meal.id)}>
                      <MdDeleteForever size={22} />
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
