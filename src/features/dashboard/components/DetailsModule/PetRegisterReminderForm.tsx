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
  const [type, setType] = useState('Comida');
  const [time, setTime] = useState('08:00');
  const [description, setDescription] = useState('');

  // Frequency in backend-valid format
  const [frequency, setFrequency] = useState<ReminderFrequency>('daily');

  // For weekly frequency
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const toggleDay = (d: string) => {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Create eventTime using today’s date (or you can add date input later)
    const today = new Date().toISOString().split('T')[0];
    const eventTime = `${today}T${time}:00`;

    const payload: CreateReminderInput = {
      petId: petId,
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Dar de comer"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Comida</option>
            <option>Medicación</option>
            <option>Paseo</option>
            <option>Higiene</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Frecuencia</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as ReminderFrequency)}
        >
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
          <option value="yearly">Anual</option>
        </select>
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
        <label>Descripción</label>
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
