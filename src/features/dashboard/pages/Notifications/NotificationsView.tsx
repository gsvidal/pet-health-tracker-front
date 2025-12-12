import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import {
  Syringe,
  Utensils,
  Pill,
  Stethoscope,
  AlertCircle,
} from 'lucide-react';
import { useNotificationStore } from '../../../../store/notification.store';
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
  const { t } = useTranslation();
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
    <section className="section section--notifications">
      <div className="container container--notifications">
        <div className="notifications-view__header">
          <h1>{t('notifications.title')}</h1>
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
            {isProcessing ? t('common.loading') : t('reminders.process')}
          </Button>
        </div>

        <div className="notifications-view__list">
          {loading || isProcessing ? (
            <div className="notifications-view__loader">
              <Loader text={t('common.loading')} size="large" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-view__empty">
              <p>{t('notifications.empty')}</p>
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
    </section>
  );
};
