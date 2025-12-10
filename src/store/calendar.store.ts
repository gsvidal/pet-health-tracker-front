import { create } from 'zustand';
import { getReminders } from '../services/reminder.service';
import { getPets } from '../services/pet.service';
import { callApi } from '../utils/apiHelper';
import { adaptPetResponseToPet } from '../adapters/pet.adapter';

export type EventType = 'vaccine' | 'deworming' | 'vet_visit' | 'nutrition';

export interface CalendarEvent {
    id: number;
    type: EventType;
    title: string;
    description: string;
    date: Date;
    time?: string;
    petName: string;
    petId: string;
}

interface CalendarState {
    events: CalendarEvent[];
    loading: boolean;
    error: string | null;
    fetchEvents: () => Promise<void>;
    getEventsForDate: (date: Date) => CalendarEvent[];
}

// Función para determinar el tipo de evento basado en el título/descripción
const determineEventType = (title: string, description: string): EventType => {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes('vacuna') || text.includes('vaccine') || text.includes('inmuniza')) {
        return 'vaccine';
    }
    if (text.includes('desparasit') || text.includes('deworm') || text.includes('parásito')) {
        return 'deworming';
    }
    if (text.includes('veterinari') || text.includes('vet ') || text.includes('consulta') || text.includes('chequeo')) {
        return 'vet_visit';
    }
    if (text.includes('nutrición') || text.includes('nutrition') || text.includes('aliment') || text.includes('comida') || text.includes('dieta')) {
        return 'nutrition';
    }

    return 'vet_visit'; // Por defecto
};

export const useCalendarStore = create<CalendarState>((set, get) => ({
    events: [],
    loading: false,
    error: null,

    fetchEvents: async () => {
        set({ loading: true, error: null });

        // Obtener recordatorios y mascotas en paralelo
        const [remindersResult, petsResult] = await Promise.all([
            callApi(() => getReminders(null, true)),
            callApi(() => getPets())
        ]);

        if (remindersResult.error || !remindersResult.data) {
            set({
                loading: false,
                error: remindersResult.error || 'Error al cargar eventos',
                events: [],
            });
            return;
        }

        // Crear un mapa de pet_id -> nombre
        const petNameMap = new Map<string, string>();
        if (petsResult.data) {
            const pets = petsResult.data.map(adaptPetResponseToPet);
            pets.forEach(pet => {
                petNameMap.set(pet.id, pet.name);
            });
        }

        // Mapear los recordatorios a eventos del calendario
        const mappedEvents = remindersResult.data.map((reminder, index) => {
            const eventDate = new Date(reminder.event_time);
            const hours = eventDate.getHours();
            const minutes = eventDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

            // Obtener el nombre real de la mascota
            const petName = petNameMap.get(reminder.pet_id) || 'Mascota';

            return {
                id: index,
                type: determineEventType(reminder.title, reminder.description || ''),
                title: reminder.title,
                description: reminder.description || '',
                date: eventDate,
                time: timeString,
                petName: petName,
                petId: reminder.pet_id,
            };
        });

        set({
            events: mappedEvents,
            loading: false,
            error: null,
        });
    },

    getEventsForDate: (date: Date) => {
        return get().events.filter(
            (event) =>
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear()
        );
    },
}));
