import type { Pet } from '../../../../models/pet.model';
import './PetNutritionSection.scss';
import { FaPlus } from 'react-icons/fa6';
import { PetRegisterFoodForm } from './PetRegisterFoodForm';
import { PetRegisterReminderForm } from './PetRegisterReminderForm';
import { useState } from 'react';
import { useMeals } from '../../../../hooks/useMeal';
import { useReminders } from '../../../../hooks/useReminders';
import { LuUtensilsCrossed } from 'react-icons/lu';
import { MdDeleteForever } from 'react-icons/md';

interface PetNutritionSectionProps {
  pet: Pet;
}

export const PetNutritionSection: React.FC<PetNutritionSectionProps> = ({
  pet,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  const { meals, loading, addMeal, removeMeal } = useMeals(pet.id);
  const { reminders, removeReminder, addReminder } = useReminders(pet.id);

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

  return (
    <div className="nutrition-container">
      {/* ---- Título principal ---- */}
      <div className="nutrition-header">
        <div className="nutrition-header-top">
          <div>
            <h3>Seguimiento Nutricional</h3>
            <p>Controla la alimentación y dieta de {pet.name}</p>
          </div>

          {/* Botón Registrar Comida */}
          {!showForm && (
            <div className="register-food-btn">
              <button id="primary-reg-btn" onClick={() => setShowForm(true)}>
                <p id="register-food-title">
                  <FaPlus className="icon-reg-food" size={15} />
                  Registrar Comida
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Formulario registro comida */}
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
          <div>
            <h4>Recordatorios de Alimentación</h4>
          </div>

          {!showReminderForm && (
            <button
              className="secondary-btn"
              onClick={() => setShowReminderForm(true)}
            >
              <p id="new-reminder-title">
                <FaPlus className="icon-reg-reminder" size={15} /> Nuevo
                Recordatorio
              </p>
            </button>
          )}
        </div>

        {/* Formulario recordatorios */}
        <div
          className={`nutrition-form-wrapper reminder-wrapper ${showReminderForm ? 'open' : ''}`}
        >
          {showReminderForm && (
            <PetRegisterReminderForm
              petId={pet.id}
              onCancel={() => setShowReminderForm(false)}
              onSubmit={async (data) => {
                console.log('DATA SUBMIT', data);
                console.log('PET ID EN SUBMIT', data.petId);
                await addReminder(data);
                setShowReminderForm(false);
              }}
            />
          )}
        </div>

        {/* Lista real desde backend */}
        <div className="reminder-list">
          {reminders.length === 0 && (
            <p className="empty">No hay recordatorios todavía.</p>
          )}

          {reminders.map((r) => (
            <div className="reminder-item" key={r.id}>
              <div className="reminder-time">
                {new Date(r.eventTime).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              <div className="reminder-info">
                <span className="reminder-label">{r.title}</span>
                <p>{r.description}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => removeReminder(r.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Historial Comidas ---- */}
      <div className="nutrition-card">
        <div className="section-title">
          <h4>Historial de Comidas</h4>
        </div>

        {loading && <p>Cargando...</p>}

        <div className="history-list">
          {meals.length === 0 ? (
            <p className="empty">No hay comidas registradas aún.</p>
          ) : (
            Object.entries(mealsByDay).map(([dayLabel, dayMeals]) => (
              <div key={dayLabel} className="history-day">
                <p>Registro completo ingresado</p>

                <div className="day-header">
                  <span className="day-title">{dayLabel}</span>
                  <span className="day-count">{dayMeals.length} comida(s)</span>
                </div>

                {dayMeals.map((meal) => (
                  <div key={meal.id} className="history-item real">
                    <div className="history-avatar">
                      <LuUtensilsCrossed size={15} />
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
