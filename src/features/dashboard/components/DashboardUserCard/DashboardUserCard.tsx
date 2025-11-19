import './DashboardUserCard.scss';
import { User as UserIcon } from 'lucide-react';
import type { User } from '../../../../models/user.model';
import { formatDateToSpanishMonthYear } from '../../../../utils/dateUtils';

interface DashboardUserCardProps {
  user: User | null;
}

export const DashboardUserCard = ({ user }: DashboardUserCardProps) => {
  return (
    <div className="dashboard-user-card">
      <div className="dashboard-user-card__header">
        <div className="dashboard-user-card__avatar">
          <UserIcon size={40} />
        </div>
        <div className="dashboard-user-card__title-section">
          <h2 className="dashboard-user-card__title">
            Información del Usuario
          </h2>
          <p className="dashboard-user-card__subtitle">Detalles de tu cuenta</p>
        </div>
      </div>

      <div className="dashboard-user-card__info">
        <div className="dashboard-user-card__info-item">
          <span className="dashboard-user-card__label">Nombre</span>
          <span className="dashboard-user-card__value">
            {user?.fullName || user?.username || 'N/A'}
          </span>
        </div>
        <div className="dashboard-user-card__info-item">
          <span className="dashboard-user-card__label">Correo</span>
          <span className="dashboard-user-card__value">
            {user?.email || 'N/A'}
          </span>
        </div>
        <div className="dashboard-user-card__info-item">
          <span className="dashboard-user-card__label">Miembro desde</span>
          <span className="dashboard-user-card__value">
            {user?.createdAt
              ? formatDateToSpanishMonthYear(user.createdAt)
              : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
