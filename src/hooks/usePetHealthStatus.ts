import { useEffect, useState } from 'react';
import { usePetStore } from '../store/pet.store';
import {
  calculateHealthStatusFromSummary,
  type HealthStatusData,
} from '../utils/healthStatus';
import type { PetHealthSummary } from '../adapters/pet.adapter';

interface UsePetHealthStatusProps {
  petId: string;
}

/**
 * Hook que obtiene el resumen de salud de una mascota desde el backend y calcula su estado
 *
 * CRITERIOS:
 *
 * SALUDABLE:
 * - Vacunaciones y desparasitaciones al día (sin vencidas ni próximas a vencer en 30 días)
 * - Última visita veterinaria hace menos de 6 meses
 *
 * ATENCIÓN REQUERIDA:
 * - Vacunaciones o desparasitaciones vencidas
 * - Vacunaciones o desparasitaciones próximas a vencer (en 30 días)
 * - Sin visita veterinaria en más de 6 meses
 *
 * REVISIÓN NECESARIA:
 * - Sin registros de salud (sin vacunaciones, desparasitaciones ni visitas)
 * - Sin visita veterinaria en más de 1 año
 */
export const usePetHealthStatus = ({
  petId,
}: UsePetHealthStatusProps): HealthStatusData & {
  loading: boolean;
  summary: PetHealthSummary | null;
} => {
  const { getPetHealthStatus } = usePetStore();
  const [healthStatus, setHealthStatus] = useState<
    HealthStatusData & { loading: boolean; summary: PetHealthSummary | null }
  >({
    status: 'Saludable',
    expiredVaccines: 0,
    expiredDewormings: 0,
    upcomingVaccines: 0,
    upcomingDewormings: 0,
    lastVetVisitDays: null,
    alertsCount: 0,
    loading: true,
    summary: null,
  });

  useEffect(() => {
    if (!petId) {
      return;
    }

    const fetchHealthStatus = async () => {
      setHealthStatus((prev) => ({ ...prev, loading: true }));

      const summary = await getPetHealthStatus(petId);

      if (!summary) {
        // Si falla, mantener estado de carga o usar valores por defecto
        setHealthStatus({
          status: 'Revisión Necesaria',
          expiredVaccines: 0,
          expiredDewormings: 0,
          upcomingVaccines: 0,
          upcomingDewormings: 0,
          lastVetVisitDays: null,
          alertsCount: 0,
          loading: false,
          summary: null,
        });
        return;
      }

      const calculated = calculateHealthStatusFromSummary(summary);
      setHealthStatus({
        ...calculated,
        loading: false,
        summary,
      });
    };

    fetchHealthStatus();
  }, [petId, getPetHealthStatus]);

  return healthStatus;
};
