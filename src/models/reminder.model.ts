export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Reminder {
  id: string;
  ownerId: string;
  petId?: string | null;
  title: string;
  description?: string | null;
  eventTime: string;
  timezone?: string | null;
  frequency: ReminderFrequency;
  rrule?: string | null;
  isActive: boolean;
  notifyByEmail: boolean;
  notifyInApp: boolean;
  createdAt: string;
  updatedAt: string;
}

