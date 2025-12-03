import { useState } from 'react';
import type {
  CreateReminderInput,
  ReminderFrequency,
} from '../../../../models/reminder.model';
import './PetRegisterReminderForm.scss';
import { FaCheck } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
  petId: string;
  onCancel: () => void;
  onSubmit: (data: CreateReminderInput) => Promise<void>;
}

export function PetRegisterReminderForm({ petId, onCancel, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<ReminderFrequency>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const toggleDay = (d: string) => {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = '* El nombre es obligatorio';
    if (!time) newErrors.time = '* La hora es obligatoria';
    if (!type) newErrors.type = '* El tipo es obligatorio';
    if (!frequency) newErrors.frequency = '* La frecuencia es obligatoria';
    if (frequency === 'weekly' && selectedDays.length === 0)
      newErrors.days = '* Selecciona al menos 1 día';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const today = new Date().toISOString().split('T')[0];
    const eventTime = `${today}T${time}:00`;
    const payload: CreateReminderInput = {
      petId,
      title,
      description,
      eventTime,
      frequency,
      notifyByEmail: false,
      notifyInApp: true,
      isActive: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    await onSubmit(payload);
  }

  return (
    <form className="reminder-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Nuevo Recordatorio</h3>
      <div className="form-group">
        <label>Nombre</label>
        <input
          className={errors.title ? 'input-error' : ''}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Dar de comer"
        />
        <div className="error-container">
          {errors.title && <p id="error-reminder-msg">{errors.title}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tipo</label>
          <select
            value={type}
            className={errors.type ? 'input-error' : ''}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Selecciona el tipo de comida</option>
            <option>Comida</option>
            <option>Medicación</option>
            <option>Paseo</option>
            <option>Higiene</option>
          </select>
          <div className="error-container">
            {errors.type && <p id="error-reminder-msg">{errors.type}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Hora</label>
          <input
            type="time"
            className={errors.time ? 'input-error' : ''}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <div className="error-container">
            {errors.time && <p id="error-reminder-msg">{errors.time}</p>}
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Frecuencia</label>
        <select
          value={frequency}
          className={errors.frequency ? 'input-error' : ''}
          onChange={(e) => setFrequency(e.target.value as ReminderFrequency)}
        >
          <option value="">Selecciona la frecuencia</option>
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
          <option value="yearly">Anual</option>
        </select>
        <div className="error-container">
          {errors.frequency && (
            <p id="error-reminder-msg">{errors.frequency}</p>
          )}
        </div>
      </div>
      {frequency === 'weekly' && (
        <div className="form-group">
          <label>Días</label>
          <div className="weekday-selector">
            {days.map((d) => (
              <div
                key={d}
                className={`day ${selectedDays.includes(d) ? 'selected' : ''}`}
                onClick={() => toggleDay(d)}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="form-group">
        <label id="description-reminder-title">Descripción</label>
        <textarea
          id="note-reminder-container"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles del recordatorio…"
        />
      </div>
      <div className="form-buttons">
        <button type="submit" className="save-reminder-btn">
          <p id="save-reminder-title">
            <FaCheck className="icon-save-reminder" size={12} />
            Guardar Recordatorio
          </p>
        </button>
        <button
          type="button"
          className="cancel-reminder-btn"
          onClick={onCancel}
        >
          <p id="cancel-reminder-title">
            <IoCloseOutline className="icon-cancel-reminder" size={15} />
            Cancelar
          </p>
        </button>
      </div>
    </form>
  );
}
