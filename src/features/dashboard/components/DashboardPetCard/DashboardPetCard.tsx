import './DashboardPetCard.scss';
import { Syringe, Calendar, Bell, Trash2, BellRing, Info } from 'lucide-react';
import type { Pet } from '../../../../models/pet.model';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { usePetHealthStatus } from '../../../../hooks/usePetHealthStatus';
import { ModalText } from '../../../../components/Modal/ModalText';
import { useState } from 'react';
import { formatDateLocal } from '../../../../utils/dateUtils';
import type { HealthStatusData } from '../../../../utils/healthStatus';
import type { PetHealthSummary } from '../../../../adapters/pet.adapter';
interface DashboardPetCardProps {
  pet: Pet;
  onViewDetails?: (petId: string) => void;
  onDelete?: (pet: Pet) => void;
  healthStatusData?: HealthStatusData & {
    loading: boolean;
    summary: PetHealthSummary | null;
  };
}

export const DashboardPetCard = ({
  pet,
  onDelete,
  healthStatusData: propHealthStatusData,
}: DashboardPetCardProps) => {
  const navigate = useNavigate();
  const hookHealthStatus = usePetHealthStatus({
    petId: pet.id,
  });

  // Usar el prop si está disponible, sino usar el hook
  const { status, alertsCount, loading, summary } =
    propHealthStatusData || hookHealthStatus;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHealthStatusModalOpen, setIsHealthStatusModalOpen] = useState(false);

  const isUnhealthy = !loading && status !== 'Saludable';
  const statusClass = loading
    ? 'loading'
    : status === 'Saludable'
      ? 'saludable'
      : status === 'Atención Requerida'
        ? 'atencion-requerida'
        : 'revision-necesaria';

  return (
    <>
      <ModalText
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="¿Qué son las Alertas Activas?"
        content={
          <div>
            <p>
              Las <strong>Alertas Activas</strong> son el número total de
              vacunaciones y desparasitaciones que requieren atención:
            </p>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              <li>
                <strong>Vacunaciones vencidas:</strong> Vacunas cuya fecha de
                próxima dosis ya pasó
              </li>
              <li>
                <strong>Desparasitaciones vencidas:</strong> Desparasitaciones
                que requieren renovación (más de 90 días desde la última)
              </li>
              <li>
                <strong>Vacunaciones próximas:</strong> Vacunas que vencen en
                los próximos 30 días
              </li>
              <li>
                <strong>Desparasitaciones próximas:</strong> Desparasitaciones
                que requieren atención pronto (60-90 días desde la última)
              </li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Este contador te ayuda a identificar rápidamente cuántas acciones
              necesitas tomar para mantener a tu mascota saludable.
            </p>
          </div>
        }
      />

      <ModalText
        isOpen={isHealthStatusModalOpen}
        onClose={() => setIsHealthStatusModalOpen(false)}
        title="Estados de Salud"
        content={
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-success-text, #147638)',
                  marginBottom: '0.5rem',
                }}
              >
                🟢 Saludable
              </h3>
              <p style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                Tu mascota está al día con sus cuidados:
              </p>
              <ul style={{ marginLeft: '2rem', paddingLeft: '0.5rem' }}>
                <li>Vacunaciones y desparasitaciones al día</li>
                <li>Sin vacunas vencidas ni próximas a vencer (30 días)</li>
                <li>Última visita veterinaria hace menos de 6 meses</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-danger-alert, #ef4444)',
                  marginBottom: '0.5rem',
                }}
              >
                🔴 Atención Requerida
              </h3>
              <p style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                Tu mascota necesita atención inmediata:
              </p>
              <ul style={{ marginLeft: '2rem', paddingLeft: '0.5rem' }}>
                <li>Vacunaciones o desparasitaciones vencidas</li>
                <li>
                  Vacunaciones o desparasitaciones próximas a vencer (30 días)
                </li>
                <li>Sin visita veterinaria en más de 6 meses</li>
              </ul>
            </div>

            <div>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-warning-text, #e1b400)',
                  marginBottom: '0.5rem',
                }}
              >
                🟡 Revisión Necesaria
              </h3>
              <p style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                Tu mascota necesita una revisión:
              </p>
              <ul style={{ marginLeft: '2rem', paddingLeft: '0.5rem' }}>
                <li>
                  Sin registros de salud (sin vacunaciones, desparasitaciones ni
                  visitas)
                </li>
                <li>Sin visita veterinaria en más de 1 año</li>
              </ul>
            </div>
          </div>
        }
      />

      <div className={`dashboard-pet-card dashboard-pet-card--${statusClass}`}>
        <div className="dashboard-pet-card__header">
          <div className="dashboard-pet-card__title-section">
            <h3 className="dashboard-pet-card__name">{pet.name}</h3>
            <p className="dashboard-pet-card__species">
              {pet.species} {pet.breed && `• ${pet.breed}`}
            </p>
          </div>
          {isUnhealthy && (
            <div className="dashboard-pet-card__alert">
              <BellRing color="#e1b400" size={15} />
            </div>
          )}
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
              {pet.ageYears
                ? pet.ageYears === 1
                  ? '1 año'
                  : `${pet.ageYears} años`
                : 'N/A'}
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
          <div className="dashboard-pet-card__health-header">
            <span className="dashboard-pet-card__health-label">
              Estado de Salud
            </span>
            <button
              className="dashboard-pet-card__info-icon"
              onClick={() => setIsHealthStatusModalOpen(true)}
              aria-label="Información sobre estados de salud"
            >
              <Info size={14} />
            </button>
          </div>
          <span
            className={`dashboard-pet-card__health-badge dashboard-pet-card__health-badge--${statusClass}`}
          >
            {loading ? 'Cargando...' : status}
          </span>
        </div>

        <div className="dashboard-pet-card__summary">
          <div className="dashboard-pet-card__summary-item">
            <Bell size={16} />
            <div className="dashboard-pet-card__summary-label-wrapper">
              <span className="dashboard-pet-card__summary-label">
                Alertas Activas
              </span>
              <button
                className="dashboard-pet-card__info-icon"
                onClick={() => setIsInfoModalOpen(true)}
                aria-label="Información sobre alertas activas"
              >
                <Info size={14} />
              </button>
            </div>
            <span className="dashboard-pet-card__summary-count">
              {loading ? '-' : alertsCount}
            </span>
          </div>
        </div>

        <div className="dashboard-pet-card__events">
          <div className="dashboard-pet-card__event">
            <Syringe size={16} />
            <div className="dashboard-pet-card__event-content">
              <span className="dashboard-pet-card__event-label">
                Próxima Vacuna
              </span>
              <span className="dashboard-pet-card__event-value">
                {loading
                  ? '-'
                  : summary?.next_vaccination_due
                    ? `${summary.next_vaccination_due.vaccine_name} - ${formatDateLocal(summary.next_vaccination_due.due_date)}`
                    : '-'}
              </span>
            </div>
          </div>
          <div className="dashboard-pet-card__event">
            <Calendar size={16} />
            <div className="dashboard-pet-card__event-content">
              <span className="dashboard-pet-card__event-label">
                Última Visita
              </span>
              <span className="dashboard-pet-card__event-value">
                {loading
                  ? '-'
                  : summary?.last_vet_visit
                    ? formatDateLocal(summary.last_vet_visit.date)
                    : '-'}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          style={{ marginTop: '2rem' }}
          onClick={() =>
            navigate(`/pets/${pet.id}`, {
              state: {
                healthStatusData: propHealthStatusData || hookHealthStatus,
              },
            })
          }
        >
          Ver Detalles
        </Button>
      </div>
    </>
  );
};
