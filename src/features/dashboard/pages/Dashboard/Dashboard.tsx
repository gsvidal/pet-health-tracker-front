import './Dashboard.scss';
import { useEffect } from 'react';
import { useAuthStore } from '../../../../store/auth.store';
import { usePetStore } from '../../../../store/pet.store';
import { DashboardUserCard } from '../../components/DashboardUserCard/DashboardUserCard';
import { DashboardPetCard } from '../../components/DashboardPetCard/DashboardPetCard';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { pets, loading, mockPets } = usePetStore();

  useEffect(() => {
    mockPets();
  }, [mockPets]);

  return (
    <>
      {/*<p style={{ fontSize: '40px' }}>//Header?</p>*/}
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
                  />
                ))}
              </div>
            )}
          </div>
          {/*<p style={{ fontSize: '40px' }}>//Boton Agregar Mascota</p>*/}
        </div>
      </section>
    </>
  );
};
