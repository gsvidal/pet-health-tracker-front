import { useState } from 'react';
import type {
  Reminder,
  ReminderFrequency,
} from '../../../../models/reminder.model';
import { ReminderService } from '../../../../services/reminder.service';
interface Props {
  petId: string;
  onClose: () => void;
  onCreated: (reminder: Reminder) => void;
}

export function PetRegisterReminder({ petId, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [frequency, setFrequency] = useState<ReminderFrequency>('once');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reminderData = {
        petId,
        title,
        description,
        eventTime,
        frequency,
        notifyByEmail: false,
        notifyInApp: true,
      };

      const created = await ReminderService.createReminder(reminderData);

      onCreated(created);
      onClose();
    } catch (error) {
      console.error('Error creando recordatorio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="pet-register-reminder" onSubmit={handleSubmit}>
      <h3>Nuevo recordatorio</h3>

      <label>Título</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Descripción</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Fecha y hora</label>
      <input
        type="datetime-local"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
        required
      />

      <label>Frecuencia</label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as ReminderFrequency)}
      >
        <option value="once">Una vez</option>
        <option value="daily">Diario</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
        <option value="yearly">Anual</option>
      </select>

      <div className="actions">
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
