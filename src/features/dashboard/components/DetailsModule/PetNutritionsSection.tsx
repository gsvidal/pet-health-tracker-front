import type { Pet } from '../../../../models/pet.model';
import './PetNutritionSection.scss';
import { FaPlus } from 'react-icons/fa6';
import { PetRegisterFoodForm } from './PetRegisterFoodForm';
import { useState } from 'react';

interface PetNutritionSectionProps {
  pet: Pet;
}
export const PetNutritionSection: React.FC<PetNutritionSectionProps> = ({
  pet,
}) => {
  const [showForm, setShowForm] = useState(false);

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
              onFoodAdded={(newMeal) => {
                console.log('Nueva comida agregada:', newMeal);
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
          <h4>Historial de Comidas</h4>
        </div>

        <div className="history-list">
          {/* Día actual */}
          <div className="history-day">
            <span className="day-label">Hoy</span>
            <div className="history-item">
              <div className="history-avatar">M</div>
              <div className="history-info">
                <div className="row">
                  <span className="time">08:00</span>
                  <span className="meal-tag">Desayuno</span>
                </div>
                <p className="food">Croquetas Premium</p>
                <p className="details">Cantidad: 200g</p>
                <p className="note">Max Comió Bien</p>
              </div>
            </div>

            <div className="history-item">
              <div className="history-avatar">M</div>
              <div className="history-info">
                <div className="row">
                  <span className="time">14:00</span>
                  <span className="meal-tag">Almuerzo</span>
                </div>
                <p className="food">Croquetas Premium</p>
                <p className="details">Cantidad: 200g</p>
              </div>
            </div>
          </div>

          {/* Día anterior */}
          <div className="history-day">
            <span className="day-label">Lunes, 24 de noviembre de 2025</span>
            <div className="history-item">
              <div className="history-avatar">M</div>
              <div className="history-info">
                <div className="row">
                  <span className="time">20:00</span>
                  <span className="meal-tag light">Cena</span>
                </div>
                <p className="food">Croquetas Premium + pollo</p>
                <p className="details">Cantidad: 250g</p>
                <p className="note">Max muy entusiasmado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
