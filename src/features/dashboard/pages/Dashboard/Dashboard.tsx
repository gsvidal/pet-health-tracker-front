import './Dashboard.scss';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../store/auth.store';
import { usePetStore } from '../../../../store/pet.store';
import { DashboardUserCard } from '../../components/DashboardUserCard/DashboardUserCard';
import { DashboardPetCard } from '../../components/DashboardPetCard/DashboardPetCard';
import { Button } from '../../../../components/Button/Button';
import { Loader } from '../../../../components/Loader/Loader';
import { Plus } from 'lucide-react';
import { Header } from '../../../../pages/Header/Header';
import { Modal } from '../../../../components/Modal/Modal';
import { ModalText } from '../../../../components/Modal/ModalText';
import { CreatePetForm } from '../PetForm/PetFormPage';
import { QuickAccessCards } from '../../components/QuickAccessCards/QuickAccessCards';
import { useCalendarStore, type CalendarEvent } from '../../../../store/calendar.store';

export const Dashboard = () => {
  const { user, getUserData } = useAuthStore();
  const { pets, loading, fetchPets, deletePet } = usePetStore();
  // Fetch events from calendar store to display counts
  const { events, fetchEvents } = useCalendarStore();
  
  const [openPetForm, setOpenPetForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<any>(null);

  useEffect(() => {
    fetchPets();
    getUserData();
    fetchEvents(); // Fetch events on dashboard load
  }, []);

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

  // Helper to get event count for a pet
  const getEventCountForPet = (petId: string) => {
    const now = new Date();
    return events.filter((e: CalendarEvent) => e.petId === petId && e.date >= now).length;
  };

  const getActiveAlertsCount = (petId: string) => {
    const now = new Date();
    // Consider past events as active alerts (overdue)
    return events.filter((e: CalendarEvent) => e.petId === petId && e.date < now).length;
  };

  const getNextVaccineLabel = (petId: string) => {
    const now = new Date();
    const vaccines = events.filter((e: CalendarEvent) => e.petId === petId && e.type === 'vaccine' && e.date >= now);
    if (vaccines.length === 0) return 'No programada';
    
    // Sort by date ascending (nearest first)
    const sorted = [...vaccines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return new Date(sorted[0].date).toLocaleDateString();
  };

  const getLastVisitLabel = (petId: string) => {
    const now = new Date();
    const visits = events.filter((e: CalendarEvent) => e.petId === petId && e.type === 'vet_visit');
    
    // Try to find past visits first (Last Visit)
    const pastVisits = visits.filter((e: CalendarEvent) => e.date < now);
    if (pastVisits.length > 0) {
        // Sort descending (most recent past first)
        const sorted = [...pastVisits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return new Date(sorted[0].date).toLocaleDateString();
    }
    
    // If no past, show next scheduled
    const futureVisits = visits.filter((e: CalendarEvent) => e.date >= now);
    if (futureVisits.length > 0) {
        // Sort ascending (nearest future first)
        const sorted = [...futureVisits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return `Prox: ${new Date(sorted[0].date).toLocaleDateString()}`;
    }

    return 'No registrada';
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
            <strong>{petToDelete?.name}</strong>?
            <br />
            <br />
          </p>
        }
        variant="confirm"
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
      />

      <Header />
      <section className="section section--dashboard">
        <div className="container container--dashboard">
          <h1 className="example__title">Dashboard</h1>
          <p>Bienvenid@ de vuelta, {user?.fullName || user?.username}</p>

          <DashboardUserCard user={user} />

          <QuickAccessCards />

          <div className="dashboard__pets-section">
            <h2 className="dashboard__pets-title">Mis Mascotas</h2>

            {loading ? (
              <Loader text="Cargando mascotas..." size="large" />
            ) : pets.length === 0 ? (
              <p className="dashboard__pets-empty">
                No tienes mascotas registradas aún.
              </p>
            ) : (
              <div className="dashboard__pets-grid">
                {pets.map((pet) => (
                  <DashboardPetCard
                    key={pet.id}
                    pet={pet}
                    healthStatus="Saludable"
                    nextVaccineLabel={getNextVaccineLabel(pet.id)}
                    lastVisitLabel={getLastVisitLabel(pet.id)}
                    activeAlertsCount={getActiveAlertsCount(pet.id)}
                    upcomingEventsCount={getEventCountForPet(pet.id)}
                    onDelete={handleDeleteClick}
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
