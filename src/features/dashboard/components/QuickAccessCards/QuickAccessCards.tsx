import { Calendar, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../../../config/routes';
import './QuickAccessCards.scss';

export const QuickAccessCards = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="quick-access">
      <div
        className="quick-access__card"
        onClick={() => navigate(PRIVATE_ROUTES.CALENDAR)}
      >
        <div className="quick-access__card-icon quick-access__card-icon--calendar">
          <Calendar size={24} />
        </div>
        <div className="quick-access__card-content">
          <h3>{t('dashboard.quickAccess.calendar.title')}</h3>
          <p>{t('dashboard.quickAccess.calendar.description')}</p>
        </div>
      </div>

      <div
        className="quick-access__card"
        onClick={() => navigate(PRIVATE_ROUTES.NOTIFICATIONS)}
      >
        <div className="quick-access__card-icon quick-access__card-icon--notifications">
          <Bell size={24} />
        </div>
        <div className="quick-access__card-content">
          <h3>{t('dashboard.quickAccess.notifications.title')}</h3>
          <p>{t('dashboard.quickAccess.notifications.description')}</p>
        </div>
      </div>
    </div>
  );
};
