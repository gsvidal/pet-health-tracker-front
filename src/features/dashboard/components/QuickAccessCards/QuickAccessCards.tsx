import { Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../../../config/routes';
import './QuickAccessCards.scss';

export const QuickAccessCards = () => {
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
          <h3>Calendario de Eventos</h3>
          <p>Ver eventos de salud y nutrición próximos</p>
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
          <h3>Centro de Notificaciones</h3>
          <p>Gestiona todas tus notificaciones</p>
        </div>
      </div>
    </div>
  );
};
