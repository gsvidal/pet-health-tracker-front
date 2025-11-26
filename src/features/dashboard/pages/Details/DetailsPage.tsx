import { useParams } from 'react-router-dom';
import { usePetDetails } from '../../../../hooks/usePetDetails';
import { Header } from '../../../../pages/Header/Header';
import { ProfilePet } from '../../../dashboard/components/DetailsModule/ProfilePet';
import { PetInformation } from '../../../dashboard/components/DetailsModule/PetInformation';

export const DetailsPage = () => {
  const { id } = useParams();

  const { pet, loading, error } = usePetDetails(id!);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pet) return <p>No se encontró la mascota</p>;

  return (
    <div className="details-page">
      <Header />

      <ProfilePet pet={pet} />

      <PetInformation pet={pet} />
    </div>
  );
};
