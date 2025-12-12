import './DashboardPetCard.scss';
import { Syringe, Calendar, Bell, Trash2, BellRing, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../../../../models/pet.model';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { usePetHealthStatus } from '../../../../hooks/usePetHealthStatus';
import { ModalText } from '../../../../components/Modal/ModalText';
import { useState } from 'react';
import { formatDateLocal, formatPetAge } from '../../../../utils/dateUtils';
import type { HealthStatusData } from '../../../../utils/healthStatus';
import type { PetHealthSummary } from '../../../../adapters/pet.adapter';
import { translateHealthStatus } from '../../../../utils/healthStatusTranslations';
import { getSpeciesLabel } from '../../../../utils/speciesUtils';
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hookHealthStatus = usePetHealthStatus({
    petId: pet.id,
  });

  // Usar el prop si está disponible, sino usar el hook
  const { status, alertsCount, loading, summary } =
    propHealthStatusData || hookHealthStatus;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHealthStatusModalOpen, setIsHealthStatusModalOpen] = useState(false);

  const translatedStatus = translateHealthStatus(status);
  const isUnhealthy = !loading && status !== 'healthy';
  const statusClass = loading
    ? 'loading'
    : status === 'healthy'
      ? 'saludable'
      : status === 'attention_required'
        ? 'atencion-requerida'
        : 'revision-necesaria';

  return (
    <>
      <ModalText
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={t('pet.healthStatus.alerts.title')}
        content={
          <div>
            <p
              dangerouslySetInnerHTML={{
                __html: t('pet.healthStatus.alerts.description'),
              }}
            />
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              <li>{t('pet.healthStatus.alerts.expiredVaccines')}</li>
              <li>{t('pet.healthStatus.alerts.expiredDewormings')}</li>
              <li>{t('pet.healthStatus.alerts.upcomingVaccines')}</li>
              <li>{t('pet.healthStatus.alerts.upcomingDewormings')}</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              {t('pet.healthStatus.alerts.help')}
            </p>
          </div>
        }
      />

      <ModalText
        isOpen={isHealthStatusModalOpen}
        onClose={() => setIsHealthStatusModalOpen(false)}
        title={t('pet.healthStatus.info.title')}
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
                {t('pet.healthStatus.info.healthy.title')}
              </h3>
              <p style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                {t('pet.healthStatus.info.healthy.description')}
              </p>
              <ul style={{ marginLeft: '2rem', paddingLeft: '0.5rem' }}>
                <li>{t('pet.healthStatus.info.healthy.criteria1')}</li>
                <li>{t('pet.healthStatus.info.healthy.criteria2')}</li>
                <li>{t('pet.healthStatus.info.healthy.criteria3')}</li>
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
                {t('pet.healthStatus.info.attentionRequired.title')}
              </h3>
              <p style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                {t('pet.healthStatus.info.attentionRequired.description')}
              </p>
              <ul style={{ marginLeft: '2rem', paddingLeft: '0.5rem' }}>
                <li>
                  {t('pet.healthStatus.info.attentionRequired.criteria1')}
                </li>
                <li>
                  {t('pet.healthStatus.info.attentionRequired.criteria2')}
                </li>
                <li>
                  {t('pet.healthStatus.info.attentionRequired.criteria3')}
                </li>
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
                {t('pet.healthStatus.info.reviewNeeded.title')}
              </h3>
              <p style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                {t('pet.healthStatus.info.reviewNeeded.description')}
              </p>
              <ul style={{ marginLeft: '2rem', paddingLeft: '0.5rem' }}>
                <li>{t('pet.healthStatus.info.reviewNeeded.criteria1')}</li>
                <li>{t('pet.healthStatus.info.reviewNeeded.criteria2')}</li>
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
              {getSpeciesLabel(pet.species)} {pet.breed && `• ${pet.breed}`}
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
            <span className="dashboard-pet-card__label">
              {t('pet.card.age')}
            </span>
            <span className="dashboard-pet-card__value">
              {formatPetAge(pet.ageYears)}
            </span>
          </div>
          <div className="dashboard-pet-card__info-item">
            <span className="dashboard-pet-card__label">
              {t('common.weight')}
            </span>
            <span className="dashboard-pet-card__value">
              {pet.weightKg
                ? `${pet.weightKg} ${t('common.kg')}`
                : t('common.noData')}
            </span>
          </div>
        </div>

        <div className="dashboard-pet-card__health">
          <div className="dashboard-pet-card__health-header">
            <span className="dashboard-pet-card__health-label">
              {t('pet.card.healthStatus')}
            </span>
            <button
              className="dashboard-pet-card__info-icon"
              onClick={() => setIsHealthStatusModalOpen(true)}
              aria-label={t('pet.healthStatus.info.title')}
            >
              <Info size={14} />
            </button>
          </div>
          <span
            className={`dashboard-pet-card__health-badge dashboard-pet-card__health-badge--${statusClass}`}
          >
            {loading ? t('common.loading') : translatedStatus}
          </span>
        </div>

        <div className="dashboard-pet-card__summary">
          <div className="dashboard-pet-card__summary-item">
            <Bell size={16} />
            <div className="dashboard-pet-card__summary-label-wrapper">
              <span className="dashboard-pet-card__summary-label">
                {t('pet.card.activeAlerts')}
              </span>
              <button
                className="dashboard-pet-card__info-icon"
                onClick={() => setIsInfoModalOpen(true)}
                aria-label={t('pet.healthStatus.alerts.title')}
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
                {t('pet.card.nextVaccine')}
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
                {t('pet.card.lastVisit')}
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
          {t('pet.card.viewDetails')}
        </Button>
      </div>
    </>
  );
};
