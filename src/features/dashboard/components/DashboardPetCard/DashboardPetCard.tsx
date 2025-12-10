import './DashboardPetCard.scss';
import { Syringe, Calendar, Bell, Trash2, BellRing } from 'lucide-react';
import type { Pet } from '../../../../models/pet.model';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useGalleryModalStore } from '../../../../store/gallery.store';
import { getPetPhotos } from '../../../../services/pet.service';

interface DashboardPetCardProps {
  pet: Pet;
  onViewDetails?: (petId: string) => void;
  onDelete?: (pet: Pet) => void;
  healthStatus?: string;
  nextVaccineLabel?: string;
  lastVisitLabel?: string;
  activeAlertsCount?: number;
  upcomingEventsCount?: number;
}

export const DashboardPetCard = ({
  pet,
  onDelete,
  healthStatus = 'Saludable',
  nextVaccineLabel = 'Próximamente',
  lastVisitLabel = 'Próximamente',
  activeAlertsCount = 0,
  upcomingEventsCount = 0,
}: DashboardPetCardProps) => {
  const navigate = useNavigate();
  const openUpload = useGalleryModalStore((s) => s.openUpload);
  const openView = useGalleryModalStore((s) => s.openView);

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
          <BellRing color="#e1b400" size={15} />
        </div>
        {onDelete && (
          <div
            className="dashboard-pet-card__delete"
            onClick={() => onDelete(pet)}
            style={{ cursor: 'pointer' }}
          >
            <Trash2 size={15} />
          </div>
        )}
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
          <Syringe size={16} color="#8200db" />
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

      <div className="dashboard-pet-card__actions">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(`/pets/${pet.id}`)}
        >
          Ver Detalles
        </Button>

        <Button variant="secondary" onClick={() => openUpload(pet.id)}>
          Subir imágenes
        </Button>

        <Button
          variant="secondary"
          onClick={async () => {
            const photos = await getPetPhotos(pet.id);
            openView(pet.id, photos);
          }}
        >
          Ver galería
        </Button>
      </div>
    </div>
  );
};
