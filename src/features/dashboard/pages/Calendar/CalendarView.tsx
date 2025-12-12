import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Syringe,
  Pill,
  Stethoscope,
  Utensils,
} from 'lucide-react';
import {
  useCalendarStore,
  type EventType,
} from '../../../../store/calendar.store';
import { usePetStore } from '../../../../store/pet.store';
import { Select } from '../../../../components/Select';
import './CalendarView.scss';

// Estos se traducen dinámicamente usando i18n
const getDaysOfWeek = (t: (key: string) => string) => [
  t('calendar.days.sun'),
  t('calendar.days.mon'),
  t('calendar.days.tue'),
  t('calendar.days.wed'),
  t('calendar.days.thu'),
  t('calendar.days.fri'),
  t('calendar.days.sat'),
];

const getMonths = (t: (key: string) => string) => [
  t('calendar.months.january'),
  t('calendar.months.february'),
  t('calendar.months.march'),
  t('calendar.months.april'),
  t('calendar.months.may'),
  t('calendar.months.june'),
  t('calendar.months.july'),
  t('calendar.months.august'),
  t('calendar.months.september'),
  t('calendar.months.october'),
  t('calendar.months.november'),
  t('calendar.months.december'),
];

const eventIcons: Record<EventType, any> = {
  vaccine: Syringe,
  deworming: Pill,
  vet_visit: Stethoscope,
  nutrition: Utensils,
};

export const CalendarView = () => {
  const { t } = useTranslation();
  const { events, fetchEvents } = useCalendarStore();
  const { pets, fetchPets } = usePetStore();

  const eventLabels: Record<EventType, string> = {
    vaccine: t('health.vaccination.title'),
    deworming: t('health.deworming.title'),
    vet_visit: t('health.visit.title'),
    nutrition: t('nutrition.title'),
  };
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Diciembre 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPet, setFilterPet] = useState<string>('all');

  // Fetch events and pets from API on mount
  useEffect(() => {
    fetchEvents();
    fetchPets();
  }, [fetchEvents, fetchPets]);

  // Crear un mapa de nombre -> id para el filtrado
  const petNameToIdMap = new Map<string, string>();
  pets.forEach((pet) => {
    petNameToIdMap.set(pet.name, pet.id);
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const sameDate =
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear();

      const typeMatch = filterType === 'all' || event.type === filterType;

      // Filtrar por petId en lugar de petName para mayor precisión
      let petMatch = true;
      if (filterPet !== 'all') {
        const selectedPetId = petNameToIdMap.get(filterPet);
        // Si el evento tiene petId, comparar por ID; si no, comparar por nombre
        if (event.petId) {
          petMatch = event.petId === selectedPetId;
        } else {
          // Para eventos sin petId, comparar por nombre
          petMatch = event.petName === filterPet;
        }
      }

      return sameDate && typeMatch && petMatch;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(clickedDate);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  // Usar todas las mascotas del usuario, no solo las que tienen eventos
  const availablePets = pets.map((pet) => pet.name).sort();

  const DAYS_OF_WEEK = getDaysOfWeek(t);
  const MONTHS = getMonths(t);

  return (
    <section className="section section--calendar">
      <div className="container container--calendar">
        <div className="calendar-view">
          <h1>{t('calendar.title')}</h1>
          {/* Filtros */}
          <div className="calendar-view__filters">
            <Select
              label={t('calendar.filterByEvent')}
              value={filterType}
              onChange={(value) => setFilterType(value || 'all')}
              options={[
                { value: 'all', label: t('calendar.allEvents') },
                { value: 'vaccine', label: t('health.vaccination.title') },
                { value: 'deworming', label: t('health.deworming.title') },
                { value: 'vet_visit', label: t('health.visit.title') },
                { value: 'nutrition', label: t('nutrition.title') },
              ]}
              placeholder={t('calendar.allEvents')}
            />

            <Select
              label={t('calendar.filterByPet')}
              value={filterPet}
              onChange={(value) => setFilterPet(value || 'all')}
              options={[
                { value: 'all', label: t('calendar.allPets') },
                ...availablePets.map((petName) => ({
                  value: petName,
                  label: petName,
                })),
              ]}
              placeholder={t('calendar.allPets')}
            />
          </div>

          <div className="calendar-view__grid">
            {/* Calendario */}
            <div className="calendar-view__calendar-card">
              <div className="calendar-view__calendar-header">
                <button onClick={handlePreviousMonth}>
                  <ChevronLeft size={20} />
                </button>
                <h2>
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Días de la semana */}
              <div className="calendar-view__weekdays">
                {DAYS_OF_WEEK.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              {/* Días del mes */}
              <div className="calendar-view__days">
                {emptyDays.map((i) => (
                  <div key={`empty-${i}`} />
                ))}
                {calendarDays.map((day) => {
                  const date = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day,
                  );
                  const dayEvents = getEventsForDate(date);
                  const isSelected =
                    selectedDate?.getDate() === day &&
                    selectedDate?.getMonth() === currentDate.getMonth();
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`calendar-view__day ${
                        isSelected
                          ? 'calendar-view__day--selected'
                          : isToday
                            ? 'calendar-view__day--today'
                            : ''
                      }`}
                    >
                      <div className="calendar-view__day-number">{day}</div>
                      <div className="calendar-view__day-dots">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`calendar-view__day-dot calendar-view__day-dot--${event.type}`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="calendar-view__day-count">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel de eventos del día seleccionado */}
            <div className="calendar-view__events-panel">
              <h3>
                <CalendarIcon size={20} />
                {selectedDate
                  ? `${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`
                  : t('calendar.selectDay')}
              </h3>

              {selectedDateEvents.length > 0 ? (
                <div className="calendar-view__events-list">
                  {selectedDateEvents.map((event) => {
                    const Icon = eventIcons[event.type];
                    return (
                      <div
                        key={event.id}
                        className={`calendar-view__event-card calendar-view__event-card--${event.type}`}
                      >
                        <div className="calendar-view__event-card-header">
                          <Icon size={16} />
                          <div style={{ flex: 1 }}>
                            <h4 className="calendar-view__event-card-title">
                              {event.title}
                            </h4>
                          </div>
                        </div>
                        <p className="calendar-view__event-card-description">
                          {event.description}
                        </p>
                        <div className="calendar-view__event-card-footer">
                          <span>{event.petName}</span>
                          {event.time && <span>{event.time}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="calendar-view__empty-state">
                  <CalendarIcon />
                  <p>
                    {selectedDate
                      ? t('calendar.noEvents')
                      : t('calendar.selectDay')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Leyenda */}
          <div className="calendar-view__legend">
            <h3>{t('calendar.legend')}</h3>
            <div className="calendar-view__legend-grid">
              {Object.entries(eventLabels).map(([type, label]) => (
                <div key={type} className="calendar-view__legend-item">
                  <div
                    className={`calendar-view__legend-item-dot calendar-view__legend-item-dot--${type}`}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
