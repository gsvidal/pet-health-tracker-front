import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePetStore } from '../../../../store/pet.store';
import { Header } from '../../../../pages/Header/Header';
import { ProfilePet } from '../../../dashboard/components/DetailsModule/ProfilePet';
import { PetInformation } from '../../../dashboard/components/DetailsModule/PetInformation';
import { Button } from '../../../../components/Button/Button';
import { ModalText } from '../../../../components/Modal/ModalText';

import './DetailsPage.scss';

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { pets, getPetById, fetchPets, deletePet } = usePetStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Si no hay mascotas cargadas → cargamos desde la API
  useEffect(() => {
    if (pets.length === 0) {
      fetchPets();
    }
  }, [pets.length, fetchPets]);

  // Buscar mascota por id
  const pet = getPetById(id!);

  if (!pet) {
    return <p>Cargando mascota...</p>;
  }

  const handleDelete = async () => {
    if (pet) {
      await deletePet(pet.id);
      navigate('/dashboard');
    }
  };

  return (
    <div className="details-page">
      <Header />
      <ProfilePet pet={pet} />
      <PetInformation pet={pet} />
      
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outline" 
          onClick={() => setIsDeleteModalOpen(true)}
          style={{ borderColor: '#ef4444', color: '#ef4444' }}
        >
          Eliminar Mascota
        </Button>
      </div>

      <ModalText
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Mascota"
        content={
          <p>
            ¿Estás seguro de que deseas eliminar a <strong>{pet.name}</strong>?
          </p>
        }
        variant="confirm"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
      />
    </div>
  );
};
