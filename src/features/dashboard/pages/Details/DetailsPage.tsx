import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { usePetStore } from '../../../../store/pet.store';
import { ProfilePet } from '../../../dashboard/components/DetailsModule/ProfilePet';
import { PetInformation } from '../../../dashboard/components/DetailsModule/PetInformation';
import { Loader } from '../../../../components/Loader/Loader';
import type { HealthStatusData } from '../../../../utils/healthStatus';
import type { PetHealthSummary } from '../../../../adapters/pet.adapter';

import './DetailsPage.scss';

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const pets = usePetStore((state) => state.pets);
  const getPetById = usePetStore((state) => state.getPetById);
  const fetchPets = usePetStore((state) => state.fetchPets);

  // Obtener healthStatusData del estado de navegación si está disponible
  const healthStatusData = location.state?.healthStatusData as
    | (HealthStatusData & {
        loading: boolean;
        summary: PetHealthSummary | null;
      })
    | undefined;

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
        <Loader text="Cargando mascota..." size="large" />
      </div>
    );
  }

  return (
    <div className="details-page">
      <ProfilePet pet={pet} healthStatusData={healthStatusData} />
      <PetInformation pet={pet} />
    </div>
  );
};
