import './DashboardUserCard.scss';
import { User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../../../models/user.model';
import { formatDateToLocalizedMonthYear } from '../../../../utils/dateUtils';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../../../config/routes';

interface DashboardUserCardProps {
  user: User | null;
}

export const DashboardUserCard = ({ user }: DashboardUserCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="dashboard-user-card">
      <div className="dashboard-user-card__header">
        <div className="dashboard-user-card__avatar">
          <UserIcon size={40} />
        </div>
        <div className="dashboard-user-card__title-section">
          <h2 className="dashboard-user-card__title">
            {t('dashboard.userCard.title')}
          </h2>
          <p className="dashboard-user-card__subtitle">
            {t('dashboard.userCard.subtitle')}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(PRIVATE_ROUTES.ACTIVITY_LOGS)}
            style={{ marginTop: '1.5rem' }}
          >
            {t('dashboard.userCard.viewActivity')}
          </Button>
        </div>
      </div>

      <div className="dashboard-user-card__info">
        <div className="dashboard-user-card__info-item">
          <span className="dashboard-user-card__label">
            {t('dashboard.userCard.name')}
          </span>
          <span className="dashboard-user-card__value">
            {user?.fullName || user?.username || t('common.noData')}
          </span>
        </div>
        <div className="dashboard-user-card__info-item">
          <span className="dashboard-user-card__label">
            {t('dashboard.userCard.email')}
          </span>
          <span className="dashboard-user-card__value">
            {user?.email || t('common.noData')}
          </span>
        </div>
        <div className="dashboard-user-card__info-item">
          <span className="dashboard-user-card__label">
            {t('dashboard.userCard.memberSince')}
          </span>
          <span className="dashboard-user-card__value">
            {user?.createdAt
              ? formatDateToLocalizedMonthYear(user.createdAt)
              : t('common.noData')}
          </span>
        </div>
      </div>
    </div>
  );
};
