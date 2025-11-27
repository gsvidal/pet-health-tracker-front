import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePetStore } from '../../../../store/pet.store';
import { Header } from '../../../../pages/Header/Header';
import { ProfilePet } from '../../../dashboard/components/DetailsModule/ProfilePet';
import { PetInformation } from '../../../dashboard/components/DetailsModule/PetInformation';

import './DetailsPage.scss';

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const pets = usePetStore((state) => state.pets);
  const getPetById = usePetStore((state) => state.getPetById);
  const mockPets = usePetStore((state) => state.mockPets);

  // Si no hay mascotas cargadas → cargamos los mocks
  useEffect(() => {
    if (pets.length === 0) {
      mockPets();
    }
  }, [pets.length, mockPets]);

  // Buscar mascota por id
  const pet = getPetById(id!);

  if (!pet) {
    return <p>Cargando mascota...</p>;
  }

  return (
    <div className="details-page">
      <Header />
      <ProfilePet pet={pet} />
      <PetInformation pet={pet} />
    </div>
  );
};
