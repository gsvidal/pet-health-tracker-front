import { useState, useMemo } from 'react';
import { useAuditLogs } from '../../../../hooks/useAuditLogs';
import type {
  AuditLogObjectType,
  SortOrder,
} from '../../../../types/auditLog.type';
import {
  OBJECT_TYPES,
  OBJECT_TYPE_LABELS,
} from '../../../../types/auditLog.type';
import { formatRelativeTime } from '../../../../utils/dateUtils';
import './ActivityLogs.scss';
import { Loader } from '../../../../components/Loader/Loader';
import {
  LuLogIn,
  LuPawPrint,
  LuSyringe,
  LuUtensilsCrossed,
  LuStethoscope,
  LuPill,
  LuBell,
  LuSearch,
  LuArrowUpDown,
} from 'react-icons/lu';
import { Button } from '../../../../components/Button/Button';

export const ActivityLogs = () => {
  const { auditLogs, allAuditLogs, loading, applyFilters, getSortedLogs } =
    useAuditLogs();
  const [selectedFilter, setSelectedFilter] = useState<
    AuditLogObjectType | 'all'
  >('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Aplicar filtro cuando cambia
  const handleFilterChange = (value: AuditLogObjectType | 'all') => {
    setSelectedFilter(value);
    if (value === 'all') {
      // Cuando se selecciona "Todos", cargar sin filtros para actualizar allAuditLogs
      applyFilters({});
    } else {
      applyFilters({
        object_type: value,
      });
    }
  };

  // Cambiar orden de clasificación
  const handleSortToggle = () => {
    const newOrder: SortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
  };

  // Logs ordenados
  const sortedLogs = useMemo(() => {
    return getSortedLogs(sortOrder);
  }, [auditLogs, sortOrder, getSortedLogs]);

  // Contar eventos por tipo usando allAuditLogs (todos los logs sin filtrar)
  const getEventCountByType = (type: AuditLogObjectType | 'all'): number => {
    if (type === 'all') {
      return allAuditLogs.length; // Total sin filtrar
    }
    return allAuditLogs.filter((log) => log.objectType === type).length;
  };

  // Obtener icono según object_type
  const getIcon = (objectType: string | null) => {
    const iconSize = 16;
    switch (objectType) {
      case 'Vaccination':
        return <LuSyringe size={iconSize} />;
      case 'Meal':
        return <LuUtensilsCrossed size={iconSize} />;
      case 'VetVisit':
        return <LuStethoscope size={iconSize} />;
      case 'Deworming':
        return <LuPill size={iconSize} />;
      case 'User':
        return <LuLogIn size={iconSize} />;
      case 'Pet':
        return <LuPawPrint size={iconSize} />;
      case 'Reminder':
        return <LuBell size={iconSize} />;
      default:
        return <LuBell size={iconSize} />;
    }
  };

  // Obtener color según object_type
  // User: yellow, Health (Vaccination, Deworming, VetVisit): pink, purple, orange
  // Nutrition (Meal): blue
  const getColor = (objectType: string | null) => {
    switch (objectType) {
      case 'Vaccination':
        return 'pink'; // Health - pink
      case 'VetVisit':
        return 'orange'; // Health - orange (en lugar de red)
      case 'Deworming':
        return 'purple'; // Health - purple
      case 'Meal':
        return 'blue'; // Nutrition - blue
      case 'User':
        return 'yellow'; // User - yellow
      case 'Pet':
        return 'green';
      case 'Reminder':
        return 'turquoise';
      default:
        return 'gray';
    }
  };

  // Traducir acción a español
  const translateAction = (action: string) => {
    const actionMap: Record<string, string> = {
      USER_LOGIN: 'Inicio de sesión',
      USER_LOGOUT: 'Cierre de sesión',
      USER_REGISTERED: 'Registro de usuario',
      USER_UPDATED: 'Usuario actualizado',
      EMAIL_VERIFIED: 'Email verificado',
      PASSWORD_RESET: 'Contraseña reseteada',
      PET_CREATED: 'Mascota creada',
      PET_UPDATED: 'Información de la mascota actualizada',
      PET_DELETED: 'Mascota eliminada',
      PET_PHOTO_UPLOADED: 'Foto de mascota subida',
      VACCINATION_CREATED: 'Vacunación creada',
      VACCINATION_UPDATED: 'Vacunación actualizada',
      VACCINATION_DELETED: 'Vacunación eliminada',
      DEWORMING_CREATED: 'Desparasitación creada',
      DEWORMING_UPDATED: 'Desparasitación actualizada',
      DEWORMING_DELETED: 'Desparasitación eliminada',
      VET_VISIT_CREATED: 'Visita creada',
      VET_VISIT_UPDATED: 'Visita actualizada',
      VET_VISIT_DELETED: 'Visita eliminada',
      MEAL_CREATED: 'Registro nutricional creado',
      MEAL_UPDATED: 'Registro nutricional actualizado',
      MEAL_DELETED: 'Registro nutricional eliminado',
      REMINDER_CREATED: 'Recordatorio creado',
      REMINDER_UPDATED: 'Recordatorio actualizado',
      REMINDER_DELETED: 'Recordatorio eliminado',
      REMINDER_PROCESSED: 'Recordatorio procesado',
    };
    return actionMap[action] || action;
  };

  // Obtener descripción del log
  const getDescription = (log: any) => {
    if (log.meta?.pet_name) {
      return `Para ${log.meta.pet_name}`;
    }
    if (log.meta?.email) {
      return `Email: ${log.meta.email}`;
    }
    if (log.objectType) {
      return `Acción sobre ${OBJECT_TYPE_LABELS[log.objectType as AuditLogObjectType] || log.objectType}`;
    }
    return 'Actividad del sistema';
  };

  return (
    <section className="section section--activity-logs">
      <div className="container container--activity-logs">
        <h1>Historial de Actividades</h1>

        <div className="activity-logs-controls">
          {/* Filtro por tipo */}
          <div className="filter-group">
            <div className="filter-label">
              <LuSearch className="filter-icon" />
              <span>Filtrar por tipo de evento</span>
            </div>
            <select
              className="filter-select"
              value={selectedFilter}
              onChange={(e) =>
                handleFilterChange(e.target.value as AuditLogObjectType | 'all')
              }
            >
              <option value="all">
                Todos los eventos ({getEventCountByType('all')})
              </option>
              {OBJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {OBJECT_TYPE_LABELS[type]} ({getEventCountByType(type)})
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por fecha */}
          <div className="sort-group">
            <div className="sort-label">
              <LuArrowUpDown className="sort-icon" />
              <span>Ordenar por fecha</span>
            </div>
            <Button
              onClick={handleSortToggle}
              variant="outline"
              style={{ height: '100%' }}
            >
              {sortOrder === 'desc'
                ? '✓ Más reciente primero'
                : '✓ Más antiguo primero'}
            </Button>
          </div>
        </div>

        {/* Lista de logs */}
        <div className="activity-logs-list">
          {loading ? (
            <Loader text="Cargando..." size="large" />
          ) : sortedLogs.length === 0 ? (
            <p className="empty-message">No hay actividades registradas</p>
          ) : (
            sortedLogs.map((log) => {
              const color = getColor(log.objectType);
              const icon = getIcon(log.objectType);
              const actionLabel = translateAction(log.action);

              return (
                <div
                  key={log.id}
                  className={`activity-log-card activity-log-card--${color}`}
                >
                  <div className="activity-log-icon">{icon}</div>
                  <div className="activity-log-content">
                    <h3 className="activity-log-title">{actionLabel}</h3>
                    <p className="activity-log-description">
                      {getDescription(log)}
                    </p>
                    <span
                      className={`activity-log-tag activity-log-tag--${color}`}
                    >
                      {log.objectType
                        ? OBJECT_TYPE_LABELS[
                            log.objectType as AuditLogObjectType
                          ] || log.objectType
                        : 'General'}
                    </span>
                  </div>
                  <div className="activity-log-time">
                    {formatRelativeTime(log.createdAt)}
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
