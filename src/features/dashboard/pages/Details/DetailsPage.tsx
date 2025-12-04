import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePetStore } from '../../../../store/pet.store';
import { Header } from '../../../../pages/Header/Header';
import { ProfilePet } from '../../../dashboard/components/DetailsModule/ProfilePet';
import { PetInformation } from '../../../dashboard/components/DetailsModule/PetInformation';
import { Loader } from '../../../../components/Loader/Loader';

import './DetailsPage.scss';

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const pets = usePetStore((state) => state.pets);
  const getPetById = usePetStore((state) => state.getPetById);
  const fetchPets = usePetStore((state) => state.fetchPets);

  // Si no hay mascotas cargadas → cargamos desde la API
  useEffect(() => {
    if (pets.length === 0) {
      fetchPets();
    }
  }, [pets.length, fetchPets]);

  // Buscar mascota por id (se recalcula cuando pets cambia)
  const pet = getPetById(id!);

  if (!pet) {
    return (
      <div className="details-page">
        <Header />
        <Loader text="Cargando mascota..." size="large" />
      </div>
    );
  }

  return (
    <div className="details-page">
      <Header />
      <ProfilePet pet={pet} />
      <PetInformation pet={pet} />
    </div>
  );
};
