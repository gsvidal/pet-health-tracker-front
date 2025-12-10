import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Syringe, Utensils, Pill, Stethoscope, AlertCircle, BellRing, RefreshCw } from 'lucide-react';
import { useNotificationStore } from '../../../../store/notification.store';
import { PRIVATE_ROUTES } from '../../../../config/routes';
import { Button } from '../../../../components/Button/Button';
import './NotificationsView.scss';

const iconMap = {
  vaccine: Syringe,
  food: Utensils,
  medicine: Pill,
  vet: Stethoscope,
};

export const NotificationsView = () => {
  const navigate = useNavigate();
  const { notifications, fetchNotifications, processDueReminders } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter((n) => !n.isRead);

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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => fetchNotifications()}
            title="Refrescar lista"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            onClick={() => processDueReminders()}
            title="Verificar nuevas notificaciones"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#ec4899', // Pink color to stand out
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
             onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fdf2f8')}
             onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <BellRing size={20} />
          </button>
        </div>
      </div>

      <div className="notifications-view__tabs">
        <Button
          variant={activeTab === 'all' ? 'primary' : 'outline'}
          size="lg"
          onClick={() => setActiveTab('all')}
        >
          Todas ({notifications.length})
        </Button>
        <Button
          variant={activeTab === 'unread' ? 'primary' : 'outline'}
          size="lg"
          onClick={() => setActiveTab('unread')}
        >
          No leídas ({notifications.filter((n) => !n.isRead).length})
        </Button>
      </div>

      <div className="notifications-view__list">
        {filteredNotifications.map((notification) => {
          const Icon = iconMap[notification.iconType] || AlertCircle;
          return (
            <div key={notification.id} className="notifications-view__card">
              <div
                className={`notifications-view__card-icon notifications-view__card-icon--${notification.iconType}`}
              >
                <Icon size={24} />
              </div>
              <div className="notifications-view__card-content">
                <h3>
                  {notification.title}
                  {!notification.isRead && (
                    <span className="notifications-view__card-dot"></span>
                  )}
                </h3>
                <p>{notification.description}</p>
                <div className="notifications-view__card-content-footer">
                  <span>{notification.petName}</span>
                  <span>•</span>
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
