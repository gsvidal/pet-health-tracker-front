import { useState, useRef, useEffect } from 'react';
import { Bell, Syringe, Utensils, Pill, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notification.store';
import { PRIVATE_ROUTES } from '../../config/routes';
import './NotificationDropdown.scss';

const iconMap = {
  vaccine: Syringe,
  food: Utensils,
  medicine: Pill,
  vet: Stethoscope,
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, fetchNotifications } = useNotificationStore();

  // const unreadCount = getUnreadCount();
  const recentNotifications = notifications.slice(0, 3);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleViewAll = () => {
    setIsOpen(false);
    navigate(PRIVATE_ROUTES.NOTIFICATIONS);
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button
        className="notification-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaciones"
      >
        <Bell size={24} />
        {/* {unreadCount > 0 && <span className="notification-dropdown__badge" />} */}
      </button>

      {isOpen && (
        <div className="notification-dropdown__menu">
          <div className="notification-dropdown__menu-header">
            <h3>Notificaciones</h3>
            {/* <span>{unreadCount} nuevas</span> */}
          </div>

          <div className="notification-dropdown__menu-body">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => {
                const Icon = iconMap[notification.iconType];
                return (
                  <div
                    key={notification.id}
                    className="notification-dropdown__item"
                    onClick={handleViewAll}
                  >
                    <div
                      className={`notification-dropdown__item-icon notification-dropdown__item-icon--${notification.iconType}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="notification-dropdown__item-content">
                      <h4>
                        {notification.title}
                        {/* {!notification.isRead && (
                          <span className="notification-dropdown__item-dot" />
                        )} */}
                      </h4>
                      <p>{notification.description}</p>
                      <span>
                        {notification.petName} • {notification.time}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="notification-dropdown__empty">
                No hay notificaciones
              </div>
            )}
          </div>

          {recentNotifications.length > 0 && (
            <div className="notification-dropdown__menu-footer">
              <button onClick={handleViewAll}>Ver todas las notificaciones</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
