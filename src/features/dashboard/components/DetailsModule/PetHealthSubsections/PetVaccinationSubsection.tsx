import type { Pet } from '../../../../../models/pet.model';

interface PetVaccinationSubsectionProps {
  pet: Pet;
}

export const PetVaccinationSubsection: React.FC<
  PetVaccinationSubsectionProps
> = ({ pet }) => {
  return (
    <div className="pet-section-card pet-section-card--vaccination">
      <h4>Vacunación</h4>
      {/* Contenido de vacunación aquí */}
    </div>
  );
};
