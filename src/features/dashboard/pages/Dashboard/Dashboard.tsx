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

export const Dashboard = () => {
  const { user, getUserData } = useAuthStore();
  const { pets, loading, fetchPets, deletePet } = usePetStore();
  const [openPetForm, setOpenPetForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<any>(null);

  useEffect(() => {
    fetchPets();
    getUserData();
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
                    nextVaccineLabel="Próximamente"
                    lastVisitLabel="Próximamente"
                    activeAlertsCount={1}
                    upcomingEventsCount={0}
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
