import './PetFilters.scss';
import { Filter, X, Check } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import type { Pet } from '../../../../models/pet.model';
import type { HealthStatus } from '../../../../utils/healthStatus';
import { Button } from '../../../../components/Button/Button';

interface PetFiltersProps {
  pets: Pet[];
  filteredCount: number;
  selectedSpecies: string | null;
  selectedHealthStatus: HealthStatus | null;
  selectedAlerts: string | null;
  onSpeciesChange: (species: string | null) => void;
  onHealthStatusChange: (status: HealthStatus | null) => void;
  onAlertsChange: (alerts: string | null) => void;
  onClearFilters: () => void;
}

export const PetFilters = ({
  pets,
  filteredCount,
  selectedSpecies,
  selectedHealthStatus,
  selectedAlerts,
  onSpeciesChange,
  onHealthStatusChange,
  onAlertsChange,
  onClearFilters,
}: PetFiltersProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const speciesRef = useRef<HTMLDivElement>(null);
  const healthRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  // Get unique species from pets
  const availableSpecies = useMemo(() => {
    const speciesSet = new Set(pets.map((pet) => pet.species).filter(Boolean));
    return Array.from(speciesSet).sort();
  }, [pets]);

  // Health status options
  const healthStatusOptions: { value: HealthStatus | null; label: string }[] = [
    { value: null, label: 'Todos' },
    { value: 'Saludable', label: 'Saludable' },
    { value: 'Atención Requerida', label: 'Atención Requerida' },
    { value: 'Revisión Necesaria', label: 'Revisión Necesaria' },
  ];

  // Alerts options
  const alertsOptions = [
    { value: null, label: 'Todas' },
    { value: 'with-alerts', label: 'Con Alertas' },
    { value: 'no-alerts', label: 'Sin Alertas' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        speciesRef.current &&
        !speciesRef.current.contains(target) &&
        healthRef.current &&
        !healthRef.current.contains(target) &&
        alertsRef.current &&
        !alertsRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdown]);

  return (
    <div className="pet-filters">
      <div className="pet-filters__header">
        <Filter size={20} className="pet-filters__icon" />
        <h3 className="pet-filters__title">Filtros</h3>
      </div>

      <div className="pet-filters__content">
        <div className="pet-filters__dropdowns">
          {/* Especie Dropdown */}
          <div className="pet-filters__dropdown-wrapper" ref={speciesRef}>
            <label className="pet-filters__label">Especie</label>
            <div className="pet-filters__dropdown">
              <button
                className="pet-filters__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(
                    openDropdown === 'species' ? null : 'species',
                  );
                }}
              >
                <span>{selectedSpecies || 'Todas'}</span>
                <span className="pet-filters__dropdown-arrow">▼</span>
              </button>
              {openDropdown === 'species' && (
                <div className="pet-filters__dropdown-menu">
                  <button
                    className={`pet-filters__dropdown-item ${
                      !selectedSpecies
                        ? 'pet-filters__dropdown-item--active'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeciesChange(null);
                      setOpenDropdown(null);
                    }}
                  >
                    Todas
                    {!selectedSpecies && <Check size={16} />}
                  </button>
                  {availableSpecies.map((species) => (
                    <button
                      key={species}
                      className={`pet-filters__dropdown-item ${
                        selectedSpecies === species
                          ? 'pet-filters__dropdown-item--active'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpeciesChange(species);
                        setOpenDropdown(null);
                      }}
                    >
                      {species}
                      {selectedSpecies === species && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Estado de Salud Dropdown */}
          <div className="pet-filters__dropdown-wrapper" ref={healthRef}>
            <label className="pet-filters__label">Estado de Salud</label>
            <div className="pet-filters__dropdown">
              <button
                className="pet-filters__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'health' ? null : 'health');
                }}
              >
                <span>
                  {healthStatusOptions.find(
                    (opt) => opt.value === selectedHealthStatus,
                  )?.label || 'Todos'}
                </span>
                <span className="pet-filters__dropdown-arrow">▼</span>
              </button>
              {openDropdown === 'health' && (
                <div className="pet-filters__dropdown-menu">
                  {healthStatusOptions.map((option) => (
                    <button
                      key={option.value || 'all'}
                      className={`pet-filters__dropdown-item ${
                        selectedHealthStatus === option.value
                          ? 'pet-filters__dropdown-item--active'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onHealthStatusChange(option.value);
                        setOpenDropdown(null);
                      }}
                    >
                      {option.label}
                      {selectedHealthStatus === option.value && (
                        <Check size={16} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alertas Dropdown */}
          <div className="pet-filters__dropdown-wrapper" ref={alertsRef}>
            <label className="pet-filters__label">Alertas</label>
            <div className="pet-filters__dropdown">
              <button
                className="pet-filters__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'alerts' ? null : 'alerts');
                }}
              >
                <span>
                  {alertsOptions.find((opt) => opt.value === selectedAlerts)
                    ?.label || 'Todas'}
                </span>
                <span className="pet-filters__dropdown-arrow">▼</span>
              </button>
              {openDropdown === 'alerts' && (
                <div className="pet-filters__dropdown-menu">
                  {alertsOptions.map((option) => (
                    <button
                      key={option.value || 'all'}
                      className={`pet-filters__dropdown-item ${
                        selectedAlerts === option.value
                          ? 'pet-filters__dropdown-item--active'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAlertsChange(option.value);
                        setOpenDropdown(null);
                      }}
                    >
                      {option.label}
                      {selectedAlerts === option.value && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <Button onClick={onClearFilters} size="sm" variant="outline">
          <X size={16} style={{ marginRight: '4px' }} />
          Limpiar Filtros
        </Button>
      </div>

      {/* Results Count */}
      <div className="pet-filters__results">
        <span>
          Mostrando {filteredCount} mascota{filteredCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};
