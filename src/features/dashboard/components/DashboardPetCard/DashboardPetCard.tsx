import './DashboardPetCard.scss';
import { AlertCircle, Syringe, Calendar, Bell } from 'lucide-react';
import type { Pet } from '../../../../models/pet.model';
import { Button } from '../../../../components/Button/Button';

interface DashboardPetCardProps {
  pet: Pet;
  onViewDetails?: (petId: string) => void;
  healthStatus?: string;
  nextVaccineLabel?: string;
  lastVisitLabel?: string;
  activeAlertsCount?: number;
  upcomingEventsCount?: number;
}

export const DashboardPetCard = ({
  pet,
  onViewDetails,
  healthStatus = 'Saludable',
  nextVaccineLabel = 'Próximamente',
  lastVisitLabel = 'Próximamente',
  activeAlertsCount = 0,
  upcomingEventsCount = 0,
}: DashboardPetCardProps) => {
  return (
    <div className="dashboard-pet-card">
      <div className="dashboard-pet-card__header">
        <div className="dashboard-pet-card__title-section">
          <h3 className="dashboard-pet-card__name">{pet.name}</h3>
          <p className="dashboard-pet-card__species">
            {pet.species} {pet.breed && `• ${pet.breed}`}
          </p>
        </div>
        <div className="dashboard-pet-card__alert">
          <AlertCircle size={20} />
        </div>
      </div>

      <div className="dashboard-pet-card__info">
        <div className="dashboard-pet-card__info-item">
          <span className="dashboard-pet-card__label">Edad</span>
          <span className="dashboard-pet-card__value">
            {pet.ageYears ? `${pet.ageYears} años` : 'N/A'}
          </span>
        </div>
        <div className="dashboard-pet-card__info-item">
          <span className="dashboard-pet-card__label">Peso</span>
          <span className="dashboard-pet-card__value">
            {pet.weightKg ? `${pet.weightKg} kg` : 'N/A'}
          </span>
        </div>
      </div>

      <div className="dashboard-pet-card__health">
        <span className="dashboard-pet-card__health-label">
          Estado de Salud
        </span>
        <span className="dashboard-pet-card__health-badge">{healthStatus}</span>
      </div>

      <div className="dashboard-pet-card__events">
        <div className="dashboard-pet-card__event">
          <Syringe size={16} color='#8200db' />
          <div className="dashboard-pet-card__event-content">
            <span className="dashboard-pet-card__event-label">
              Próxima Vacuna
            </span>
            <span className="dashboard-pet-card__event-value">
              {nextVaccineLabel}
            </span>
          </div>
        </div>
        <div className="dashboard-pet-card__event">
          <Calendar size={16} color="#ec4899" />
          <div className="dashboard-pet-card__event-content">
            <span className="dashboard-pet-card__event-label">
              Última Visita
            </span>
            <span className="dashboard-pet-card__event-value">
              {lastVisitLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-pet-card__summary">
        <div className="dashboard-pet-card__summary-item">
          <Bell size={16} />
          <span className="dashboard-pet-card__summary-label">
            Alertas Activas
          </span>
          <span className="dashboard-pet-card__summary-count">
            {activeAlertsCount}
          </span>
        </div>
        <div className="dashboard-pet-card__summary-item">
          <Calendar size={16} />
          <span className="dashboard-pet-card__summary-label">
            Eventos Próximos
          </span>
          <span className="dashboard-pet-card__summary-count">
            {upcomingEventsCount}
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        // className="dashboard-pet-card__button"
        style={{ marginTop: '2rem' }}
        onClick={() => onViewDetails?.(pet.id)}
      >
        Ver Detalles
      </Button>
    </div>
  );
};
