import React, { useState } from 'react';
import './PetRegisterFoodForm.scss';
import type { Pet } from '../../../../models/pet.model';
import { FaCheck } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import type { MealInput } from '../../../../models/meal.model';

interface PetRegisterFoodFormProps {
  pet: Pet;
  onClose: () => void;
  onFoodAdded: (meal: MealInput) => void;
}

export const PetRegisterFoodForm: React.FC<PetRegisterFoodFormProps> = ({
  pet,
  onClose,
  onFoodAdded,
}) => {
  console.log('🐶 pet recibido en formulario:', pet);

  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: today,
    time: '',
    type: '',
    food: '',
    quantity: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = '* La fecha es obligatoria';
    if (!formData.time) newErrors.time = '* La hora es obligatoria';
    if (!formData.type) newErrors.type = '* El tipo de comida es obligatorio';
    if (!formData.food) newErrors.food = '* El alimento es obligatorio';
    if (!formData.quantity) newErrors.quantity = '* La cantidad es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    if (!validate()) return;
    if (!pet?.id) {
      console.error('❌ ERROR: pet.id es undefined');
      return;
    }
    const meal: MealInput = {
      petId: pet.id,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      food: formData.food,
      quantity: formData.quantity,
      notes: formData.notes,
    };

    console.log('🚀 MealInput enviado:', meal);

    onFoodAdded(meal);
  };

  return (
    <div className="register-food-card">
      <h3>Registrar Nueva Comida</h3>

      {/* FECHA & HORA */}
      <div className="row-two">
        <div className="field">
          <label>Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'input-error' : ''}
          />
          <div className="error-container">
            {errors.date && <p id="error-msg">{errors.date}</p>}
          </div>
        </div>

        <div className="field">
          <label>Hora</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={errors.time ? 'input-error' : ''}
          />
          <div className="error-container">
            {errors.time && <p id="error-msg">{errors.time}</p>}
          </div>
        </div>
      </div>

      {/* TIPO */}
      <div className="field">
        <label>Tipo de Comida</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={errors.type ? 'input-error' : ''}
        >
          <option value="">Selecciona el tipo de comida</option>
          <option value="Desayuno">Desayuno</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Cena">Cena</option>
          <option value="Snack">Snack</option>
        </select>
        <div className="error-container">
          {errors.type && <p id="error-msg">{errors.type}</p>}
        </div>
      </div>

      {/* ALIMENTO */}
      <div className="field">
        <label>Alimento</label>
        <input
          type="text"
          name="food"
          placeholder="Ej: Croquetas Premium, Pavo, Carne..."
          value={formData.food}
          onChange={handleChange}
          className={errors.food ? 'input-error' : ''}
        />
        <div className="error-container">
          {errors.food && <p id="error-msg">{errors.food}</p>}
        </div>
      </div>

      {/* CANTIDAD */}
      <div className="field">
        <label>Cantidad</label>
        <input
          type="text"
          name="quantity"
          placeholder="Ej: 200g, 1 taza..."
          value={formData.quantity}
          onChange={handleChange}
          className={errors.quantity ? 'input-error' : ''}
        />
        <div className="error-container">
          {errors.quantity && <p id="error-msg">{errors.quantity}</p>}
        </div>
      </div>

      {/* NOTAS */}
      <div className="field">
        <label>Notas (opcional)</label>
        <textarea
          id="note-container"
          name="notes"
          placeholder="Observaciones sobre esta comida..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* BOTONES */}
      <div className="buttons-row">
        <button id="primary-food-btn" onClick={handleSubmit}>
          <p id="save-food-title">
            <FaCheck className="icon-save-food" size={12} />
            Guardar Comida
          </p>
        </button>
        <button id="cancel-food-btn" onClick={onClose}>
          <p id="cancel-food-title">
            <IoCloseOutline className="icon-cancel-food" size={15} />
            Cancelar
          </p>
        </button>
      </div>
    </div>
  );
};
