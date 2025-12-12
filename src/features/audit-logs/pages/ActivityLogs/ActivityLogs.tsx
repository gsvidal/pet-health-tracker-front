import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuditLogs } from '../../../../hooks/useAuditLogs';
import type {
  AuditLogObjectType,
  SortOrder,
} from '../../../../types/auditLog.type';
import { OBJECT_TYPES } from '../../../../types/auditLog.type';
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
  LuArrowUpDown,
} from 'react-icons/lu';
import { Button } from '../../../../components/Button/Button';
import { Select } from '../../../../components/Select';

export const ActivityLogs = () => {
  const { t } = useTranslation();
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

  // Traducir acción usando i18n
  const translateAction = (action: string) => {
    const translationKey = `activity.actions.${action}`;
    const translated = t(translationKey);
    // Si la traducción es igual a la clave, significa que no existe, retornar la acción original
    return translated !== translationKey ? translated : action;
  };

  // Obtener descripción del log
  const getDescription = (log: any) => {
    if (log.meta?.pet_name) {
      return t('activity.forPet', { petName: log.meta.pet_name });
    }
    if (log.meta?.email) {
      return t('activity.email', { email: log.meta.email });
    }
    if (log.objectType) {
      const objectTypeLabel =
        t(`activity.objectTypes.${log.objectType}`) || log.objectType;
      return t('activity.actionOn', { objectType: objectTypeLabel });
    }
    return t('activity.systemActivity');
  };

  return (
    <section className="section section--activity-logs">
      <div className="container container--activity-logs">
        <h1>{t('activity.title')}</h1>

        <div className="activity-logs-controls">
          {/* Filtro por tipo */}
          <Select
            label={t('activity.filterByTypeLabel')}
            value={selectedFilter === 'all' ? null : selectedFilter}
            onChange={(value) =>
              handleFilterChange((value || 'all') as AuditLogObjectType | 'all')
            }
            options={[
              {
                value: 'all',
                label: `${t('activity.allTypes')} (${getEventCountByType('all')})`,
              },
              ...OBJECT_TYPES.map((type) => ({
                value: type,
                label: `${t(`activity.objectTypes.${type}`)} (${getEventCountByType(type)})`,
              })),
            ]}
            placeholder={`${t('activity.allTypes')} (${getEventCountByType('all')})`}
          />

          {/* Ordenar por fecha */}
          <div className="sort-group">
            <div className="sort-label">
              <LuArrowUpDown className="sort-icon" />
              <span>{t('activity.sortByDate')}</span>
            </div>
            <Button
              onClick={handleSortToggle}
              variant="outline"
              style={{ height: '100%' }}
            >
              {sortOrder === 'desc'
                ? `✓ ${t('activity.mostRecentFirst')}`
                : `✓ ${t('activity.oldestFirst')}`}
            </Button>
          </div>
        </div>

        {/* Lista de logs */}
        <div className="activity-logs-list">
          {loading ? (
            <Loader text={t('common.loading')} size="large" />
          ) : sortedLogs.length === 0 ? (
            <p className="empty-message">{t('activity.empty')}</p>
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
                        ? t(`activity.objectTypes.${log.objectType}`) ||
                          log.objectType
                        : t('common.all')}
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
