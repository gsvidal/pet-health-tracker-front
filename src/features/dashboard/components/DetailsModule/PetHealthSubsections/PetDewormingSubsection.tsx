import type { Pet } from '../../../../../models/pet.model';

interface PetDewormingSubsectionProps {
  pet: Pet;
}

export const PetDewormingSubsection: React.FC<PetDewormingSubsectionProps> = ({
  pet,
}) => {
  return (
    <div className="pet-section-card pet-section-card--deworming">
      <h4>Desparasitación</h4>
      {/* Contenido de desparasitación aquí */}
    </div>
  );
};
