import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Syringe,
  Utensils,
  Pill,
  Stethoscope,
  AlertCircle,
} from 'lucide-react';
import { useNotificationStore } from '../../../../store/notification.store';
import { PRIVATE_ROUTES } from '../../../../config/routes';
import { Button } from '../../../../components/Button/Button';
import { Loader } from '../../../../components/Loader/Loader';
import './NotificationsView.scss';

const iconMap = {
  vaccine: Syringe,
  food: Utensils,
  medicine: Pill,
  vet: Stethoscope,
};

export const NotificationsView = () => {
  const navigate = useNavigate();
  const { notifications, fetchNotifications, processDueReminders, loading } =
    useNotificationStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch notifications on mount and process due reminders
  useEffect(() => {
    const loadData = async () => {
      await fetchNotifications();
      // Procesar recordatorios vencidos al cargar
      await processDueReminders();
    };

    loadData();

    // Poll for due reminders every 5 minutes
    const intervalId = setInterval(
      () => {
        processDueReminders();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchNotifications, processDueReminders]);

  const handleProcessReminders = async () => {
    setIsProcessing(true);
    try {
      await processDueReminders();
      // fetchNotifications ya se llama dentro de processDueReminders
    } catch (error) {
      console.error('Error procesando recordatorios:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="notifications-view">
      <div className="notifications-view__header">
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
        <h1>Notificaciones</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleProcessReminders}
          disabled={isProcessing || loading}
          style={{ marginLeft: 'auto' }}
        >
          <RefreshCw
            size={16}
            style={{
              marginRight: '0.5rem',
              animation: isProcessing ? 'spin 1s linear infinite' : 'none',
            }}
          />
          {isProcessing ? 'Procesando...' : 'Procesar Recordatorios'}
        </Button>
      </div>

      <div className="notifications-view__list">
        {loading || isProcessing ? (
          <div className="notifications-view__loader">
            <Loader
              text={
                isProcessing
                  ? 'Procesando recordatorios...'
                  : 'Cargando notificaciones...'
              }
              size="large"
            />
          </div>
        ) : notifications.length === 0 ? (
          <div className="notifications-view__empty">
            <p>No hay notificaciones</p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginTop: '0.5rem',
              }}
            >
              Las notificaciones se generan cuando los recordatorios vencen y se
              procesan.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = iconMap[notification.iconType] || AlertCircle;
            return (
              <div key={notification.id} className="notifications-view__card">
                <div
                  className={`notifications-view__card-icon notifications-view__card-icon--${notification.iconType}`}
                >
                  <Icon size={24} />
                </div>
                <div className="notifications-view__card-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.description}</p>
                  <div className="notifications-view__card-content-footer">
                    <span>{notification.petName}</span>
                    <span>•</span>
                    <span>{notification.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
