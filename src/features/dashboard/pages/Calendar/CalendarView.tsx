import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Syringe, Pill, Stethoscope, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCalendarStore, type EventType } from '../../../../store/calendar.store';
import { PRIVATE_ROUTES } from '../../../../config/routes';
import './CalendarView.scss';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const eventIcons: Record<EventType, any> = {
  vaccine: Syringe,
  deworming: Pill,
  vet_visit: Stethoscope,
  nutrition: Utensils,
};

const eventLabels: Record<EventType, string> = {
  vaccine: 'Vacunación',
  deworming: 'Desparasitación',
  vet_visit: 'Visita Veterinaria',
  nutrition: 'Nutrición',
};

export const CalendarView = () => {
  const navigate = useNavigate();
  const { events, fetchEvents } = useCalendarStore();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Diciembre 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPet, setFilterPet] = useState<string>('all');

  // Fetch events from API on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
      const petMatch = filterPet === 'all' || event.petName === filterPet;

      return sameDate && typeMatch && petMatch;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const uniquePets = Array.from(new Set(events.map((e) => e.petName)));

  return (
    <div className="calendar-view">
      {/* Header */}
      <header className="calendar-view__header">
        <div className="calendar-view__header-content">
          <button
            onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              color: '#64748b',
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1>Calendario de Eventos</h1>
            <p>Eventos de salud y nutrición próximos</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="calendar-view__main">
        {/* Filtros */}
        <div className="calendar-view__filters">
          <div className="calendar-view__filter-group">
            <label>
              <Filter size={16} />
              Filtrar por tipo de evento
            </label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Todos los eventos</option>
              <option value="vaccine">Vacunaciones</option>
              <option value="deworming">Desparasitación</option>
              <option value="vet_visit">Visitas Veterinarias</option>
              <option value="nutrition">Nutrición</option>
            </select>
          </div>

          <div className="calendar-view__filter-group">
            <label>
              <Filter size={16} />
              Filtrar por mascota
            </label>
            <select value={filterPet} onChange={(e) => setFilterPet(e.target.value)}>
              <option value="all">Todas las mascotas</option>
              {uniquePets.map((pet) => (
                <option key={pet} value={pet}>
                  {pet}
                </option>
              ))}
            </select>
          </div>
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
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
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
                        <span style={{ fontSize: '0.625rem', color: '#6b7280' }}>
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
                : 'Selecciona un día'}
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
                          <h4 className="calendar-view__event-card-title">{event.title}</h4>
                        </div>
                      </div>
                      <p className="calendar-view__event-card-description">{event.description}</p>
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
                    ? 'No hay eventos programados para este día'
                    : 'Selecciona un día en el calendario para ver los eventos'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Leyenda */}
        <div className="calendar-view__legend">
          <h3>Leyenda de Eventos</h3>
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
      </main>
    </div>
  );
};
