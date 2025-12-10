import './Dashboard.scss';
import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../../../../store/auth.store';
import { usePetStore } from '../../../../store/pet.store';
import { DashboardUserCard } from '../../components/DashboardUserCard/DashboardUserCard';
import { DashboardPetCard } from '../../components/DashboardPetCard/DashboardPetCard';
import { PetFilters } from '../../components/PetFilters/PetFilters';
import { Button } from '../../../../components/Button/Button';
import { Loader } from '../../../../components/Loader/Loader';
import { Plus } from 'lucide-react';
import { Modal } from '../../../../components/Modal/Modal';
import { ModalText } from '../../../../components/Modal/ModalText';
import { CreatePetForm } from '../PetForm/PetFormPage';
import { calculateHealthStatusFromSummary } from '../../../../utils/healthStatus';
import type {
  HealthStatus,
  HealthStatusData,
} from '../../../../utils/healthStatus';
import type { PetHealthSummary } from '../../../../adapters/pet.adapter';
import { QuickAccessCards } from '../../components/QuickAccessCards/QuickAccessCards';
import {
  useCalendarStore,
  type CalendarEvent,
} from '../../../../store/calendar.store';

interface PetHealthData extends HealthStatusData {
  loading: boolean;
  summary: PetHealthSummary | null;
}

export const Dashboard = () => {
  const { user, getUserData } = useAuthStore();
  const { pets, loading, fetchPets, deletePet, getPetHealthStatus } =
    usePetStore();
  // Fetch events from calendar store to display counts
  const { events, fetchEvents } = useCalendarStore();

  const [openPetForm, setOpenPetForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<any>(null);

  // Filter states
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedHealthStatus, setSelectedHealthStatus] =
    useState<HealthStatus | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<string | null>(null);

  // Store complete health data for each pet
  const [petHealthData, setPetHealthData] = useState<
    Record<string, PetHealthData>
  >({});

  useEffect(() => {
    fetchPets();
    getUserData();
    fetchEvents(); // Fetch events on dashboard load
  }, []);

  // Fetch health statuses for all pets
  useEffect(() => {
    if (pets.length === 0) return;

    const fetchAllHealthStatuses = async () => {
      const healthData: Record<string, PetHealthData> = {};

      await Promise.all(
        pets.map(async (pet) => {
          try {
            const summary = await getPetHealthStatus(pet.id);
            if (summary) {
              const calculated = calculateHealthStatusFromSummary(summary);
              healthData[pet.id] = {
                ...calculated,
                loading: false,
                summary,
              };
            } else {
              // Default to "Revisión Necesaria" if no summary
              healthData[pet.id] = {
                status: 'Revisión Necesaria',
                expiredVaccines: 0,
                expiredDewormings: 0,
                upcomingVaccines: 0,
                upcomingDewormings: 0,
                lastVetVisitDays: null,
                alertsCount: 0,
                loading: false,
                summary: null,
              };
            }
          } catch (error) {
            console.error(
              `Error fetching health status for pet ${pet.id}:`,
              error,
            );
            healthData[pet.id] = {
              status: 'Revisión Necesaria',
              expiredVaccines: 0,
              expiredDewormings: 0,
              upcomingVaccines: 0,
              upcomingDewormings: 0,
              lastVetVisitDays: null,
              alertsCount: 0,
              loading: false,
              summary: null,
            };
          }
        }),
      );

      setPetHealthData(healthData);
    };

    fetchAllHealthStatuses();
  }, [pets, getPetHealthStatus]);

  // Filter pets based on filters
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const healthData = petHealthData[pet.id];

      // Species filter
      if (selectedSpecies && pet.species !== selectedSpecies) {
        return false;
      }

      // Health status filter
      if (selectedHealthStatus) {
        if (!healthData || healthData.status !== selectedHealthStatus) {
          return false;
        }
      }

      // Alerts filter - use alertsCount instead of status
      if (selectedAlerts) {
        if (!healthData) {
          // If no health data, consider it as no alerts
          if (selectedAlerts === 'with-alerts') {
            return false;
          }
          return true;
        }

        const hasAlerts = healthData.alertsCount > 0;

        if (selectedAlerts === 'with-alerts' && !hasAlerts) {
          return false;
        }
        if (selectedAlerts === 'no-alerts' && hasAlerts) {
          return false;
        }
      }

      return true;
    });
  }, [
    pets,
    selectedSpecies,
    selectedHealthStatus,
    selectedAlerts,
    petHealthData,
  ]);

  const handleDeleteClick = (pet: any) => {
    setPetToDelete(pet);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (petToDelete) {
      await deletePet(petToDelete.id);
      setIsDeleteModalOpen(false);
      setPetToDelete(null);
    }
  };

  const clearFilters = () => {
    setSelectedSpecies(null);
    setSelectedHealthStatus(null);
    setSelectedAlerts(null);
  };

    return (
      <>
        {/* Modal de Login */}
        <Modal isOpen={openPetForm} onClose={() => setOpenPetForm(false)}>
          <CreatePetForm />
        </Modal>

        <ModalText
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="¿Estás seguro?"
          content={
            <p>
              ¿Estas seguro de eliminar esta mascota?{' '}
              <strong>({petToDelete?.name})</strong>
              <br />
              <br />
            </p>
          }
          variant="confirm"
          confirmLabel="Confirmar"
          cancelLabel="Cancelar"
          onConfirm={confirmDelete}
        />

        <section className="section section--dashboard">
          <div className="container container--dashboard">
            <h1 className="example__title">Dashboard</h1>
            <p>Bienvenid@ de vuelta, {user?.fullName || user?.username}</p>

            <DashboardUserCard user={user} />

            <QuickAccessCards />

            <div className="dashboard__pets-section">
              <div className="dashboard__pets-header">
                <h2 className="dashboard__pets-title">Mis Mascotas</h2>

                {/* Filters */}
                {!loading && pets.length > 0 && (
                  <PetFilters
                    pets={pets}
                    filteredCount={filteredPets.length}
                    selectedSpecies={selectedSpecies}
                    selectedHealthStatus={selectedHealthStatus}
                    selectedAlerts={selectedAlerts}
                    onSpeciesChange={setSelectedSpecies}
                    onHealthStatusChange={setSelectedHealthStatus}
                    onAlertsChange={setSelectedAlerts}
                    onClearFilters={clearFilters}
                  />
                )}
              </div>

              {loading ? (
                <Loader text="Cargando mascotas..." size="large" />
              ) : pets.length === 0 ? (
                <p className="dashboard__pets-empty">
                  No tienes mascotas registradas aún.
                </p>
              ) : filteredPets.length === 0 ? (
                <p className="dashboard__pets-empty">
                  No se encontraron mascotas con los filtros seleccionados.
                </p>
              ) : (
                <div className="dashboard__pets-grid">
                  {filteredPets.map((pet) => (
                    <DashboardPetCard
                      key={pet.id}
                      pet={pet}
                      onDelete={handleDeleteClick}
                      healthStatusData={petHealthData[pet.id]}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* <div className='button'> */}
            <Button
              variant="outline"
              size="lg"
              style={{ width: '100%', marginTop: '29px' }}
              onClick={() => setOpenPetForm(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Mascota
            </Button>
            {/* </div> */}
          </div>
        </section>
      </>
    );
};
