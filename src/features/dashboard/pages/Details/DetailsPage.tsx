import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePetStore } from '../../../../store/pet.store';
import { Header } from '../../../../pages/Header/Header';
import { ProfilePet } from '../../../dashboard/components/DetailsModule/ProfilePet';
import { PetInformation } from '../../../dashboard/components/DetailsModule/PetInformation';


import './DetailsPage.scss';

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { pets, getPetById, fetchPets } = usePetStore();


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

  return (
    <div className="details-page">
      <Header />
      <ProfilePet pet={pet} />
      <PetInformation pet={pet} />
      
    </div>
  );
};
