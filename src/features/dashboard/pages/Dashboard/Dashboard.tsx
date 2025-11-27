import './Dashboard.scss';
import { useEffect } from 'react';
import { useAuthStore } from '../../../../store/auth.store';
import { usePetStore } from '../../../../store/pet.store';
import { DashboardUserCard } from '../../components/DashboardUserCard/DashboardUserCard';
import { DashboardPetCard } from '../../components/DashboardPetCard/DashboardPetCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/Button/Button';
import { Plus } from 'lucide-react';
import { Header } from '../../../../pages/Header/Header';

export const Dashboard = () => {
  const { user, getUserData } = useAuthStore();
  const { pets, loading, mockPets } = usePetStore();
  const router = useNavigate();

  useEffect(() => {
    mockPets();
    getUserData();
  }, []);

  const handleViewDetails = (petId: string) => {
    router(`/pets/${petId}`);
  };

  return (
    <>
      <Header />
      <section className="section section--dashboard">
        <div className="container container--dashboard">
          <h1 className="example__title">Dashboard</h1>
          <p>Bienvenid@ de vuelta, {user?.fullName}</p>

          <DashboardUserCard user={user} />

          <div className="dashboard__pets-section">
            <h2 className="dashboard__pets-title">Mis Mascotas</h2>

            {loading ? (
              <p className="dashboard__pets-loading">Cargando mascotas...</p>
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
                    nextVaccineLabel="Próximamente"
                    lastVisitLabel="Próximamente"
                    activeAlertsCount={1}
                    upcomingEventsCount={0}
                    onViewDetails={handleViewDetails}
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
            onClick={() => router('/pets/create')}
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
