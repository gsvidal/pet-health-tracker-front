import { useEffect, useState } from 'react';
import type { Reminder } from '../models/reminder.model';
import { ReminderService } from '../services/reminder.service';

export function useReminders(petId: string) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      try {
        const all = await ReminderService.getAll();
        if (isMounted) {
          setReminders(all.filter((r) => r.petId === petId));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [petId]);

  async function addReminder(input: Partial<Reminder>) {
    const r = await ReminderService.createReminder(input);
    setReminders((prev) => [...prev, r]);
  }

  async function removeReminder(id: string) {
    await ReminderService.deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  return {
    reminders,
    loading,
    addReminder,
    removeReminder,
  };
}
