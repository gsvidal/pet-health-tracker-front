import type { Vaccine } from '../models/vaccine.model';
import type { Deworming } from '../models/deworming.model';
import type { VetVisit } from '../models/vetVisit.model';
import { parseDateLocal } from './dateUtils';
import type { PetHealthSummary } from '../adapters/pet.adapter';

// Códigos internos en inglés (no cambian con el idioma)
export type HealthStatus = 'healthy' | 'attention_required' | 'review_needed';

export interface HealthStatusData {
  status: HealthStatus;
  expiredVaccines: number;
  expiredDewormings: number;
  upcomingVaccines: number;
  upcomingDewormings: number;
  lastVetVisitDays: number | null;
  alertsCount: number;
}

/**
 * Calcula el estado de salud basado en los datos procesados
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
function calculateStatusFromData(
  expiredVaccines: number,
  expiredDewormings: number,
  upcomingVaccines: number,
  upcomingDewormings: number,
  lastVetVisitDays: number | null,
  hasAnyRecords: boolean,
): HealthStatus {
  if (expiredVaccines > 0 || expiredDewormings > 0) {
    return 'attention_required';
  } else if (
    upcomingVaccines > 0 ||
    upcomingDewormings > 0 ||
    (lastVetVisitDays !== null && lastVetVisitDays > 180)
  ) {
    return 'attention_required';
  } else if (!hasAnyRecords) {
    return 'review_needed';
  } else if (lastVetVisitDays !== null && lastVetVisitDays > 365) {
    return 'review_needed';
  } else {
    return 'healthy';
  }
}

/**
 * Calcula el estado de salud de una mascota desde arrays de datos
 */
export function calculateHealthStatus(
  vaccines: Vaccine[],
  dewormings: Deworming[],
  vetVisits: VetVisit[],
): HealthStatusData {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  let expiredVaccines = 0;
  let upcomingVaccines = 0;
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  vaccines.forEach((vaccine) => {
    if (vaccine.nextDue) {
      const nextDueDate = parseDateLocal(vaccine.nextDue);
      nextDueDate.setHours(12, 0, 0, 0);
      if (nextDueDate < today) {
        expiredVaccines++;
      } else if (nextDueDate <= thirtyDaysFromNow) {
        upcomingVaccines++;
      }
    }
  });

  let expiredDewormings = 0;
  let upcomingDewormings = 0;

  dewormings.forEach((deworming) => {
    if (deworming.nextDue) {
      const nextDueDate = parseDateLocal(deworming.nextDue);
      nextDueDate.setHours(12, 0, 0, 0);
      if (nextDueDate < today) {
        expiredDewormings++;
      } else if (nextDueDate <= thirtyDaysFromNow) {
        upcomingDewormings++;
      }
    }
  });

  let lastVetVisitDays: number | null = null;
  if (vetVisits.length > 0) {
    const sortedVisits = [...vetVisits].sort(
      (a, b) =>
        new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
    );
    const lastVisitDate = parseDateLocal(sortedVisits[0].visitDate);
    lastVisitDate.setHours(12, 0, 0, 0);
    const diffTime = today.getTime() - lastVisitDate.getTime();
    lastVetVisitDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  const alertsCount =
    expiredVaccines + expiredDewormings + upcomingVaccines + upcomingDewormings;

  const status = calculateStatusFromData(
    expiredVaccines,
    expiredDewormings,
    upcomingVaccines,
    upcomingDewormings,
    lastVetVisitDays,
    vaccines.length > 0 || dewormings.length > 0 || vetVisits.length > 0,
  );

  return {
    status,
    expiredVaccines,
    expiredDewormings,
    upcomingVaccines,
    upcomingDewormings,
    lastVetVisitDays,
    alertsCount,
  };
}

/**
 * Calcula el estado de salud basado en el health summary del backend
 */
export function calculateHealthStatusFromSummary(
  summary: PetHealthSummary,
): HealthStatusData {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  let expiredVaccines = 0;
  let upcomingVaccines = 0;
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  // Verificar próxima vacunación
  if (summary.next_vaccination_due) {
    const nextDueDate = parseDateLocal(summary.next_vaccination_due.due_date);
    nextDueDate.setHours(12, 0, 0, 0);
    if (nextDueDate < today) {
      expiredVaccines = 1;
    } else if (nextDueDate <= thirtyDaysFromNow) {
      upcomingVaccines = 1;
    }
  }

  // Para desparasitaciones, verificamos si está vencida (más de 3 meses desde la última)
  let expiredDewormings = 0;
  let upcomingDewormings = 0;

  if (summary.last_deworming) {
    const lastDewormingDate = parseDateLocal(summary.last_deworming.date);
    lastDewormingDate.setHours(12, 0, 0, 0);
    const daysSinceDeworming = Math.floor(
      (today.getTime() - lastDewormingDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    // Si pasaron más de 90 días desde la última desparasitación, considerar vencida
    if (daysSinceDeworming > 90) {
      expiredDewormings = 1;
    } else if (daysSinceDeworming > 60) {
      upcomingDewormings = 1;
    }
  }

  let lastVetVisitDays: number | null = null;
  if (summary.last_vet_visit) {
    const lastVisitDate = parseDateLocal(summary.last_vet_visit.date);
    lastVisitDate.setHours(12, 0, 0, 0);
    const diffTime = today.getTime() - lastVisitDate.getTime();
    lastVetVisitDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  const alertsCount =
    expiredVaccines + expiredDewormings + upcomingVaccines + upcomingDewormings;

  const status = calculateStatusFromData(
    expiredVaccines,
    expiredDewormings,
    upcomingVaccines,
    upcomingDewormings,
    lastVetVisitDays,
    !!(
      summary.last_vaccination ||
      summary.last_deworming ||
      summary.last_vet_visit
    ),
  );

  return {
    status,
    expiredVaccines,
    expiredDewormings,
    upcomingVaccines,
    upcomingDewormings,
    lastVetVisitDays,
    alertsCount,
  };
}
