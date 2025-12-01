import type { Pet } from '../../../../../models/pet.model';

interface PetVisitSubsectionProps {
  pet: Pet;
}

export const PetVisitSubsection: React.FC<PetVisitSubsectionProps> = ({
  pet,
}) => {
  return (
    <div className="pet-section-card pet-section-card--visit">
      <h4>Visitas al Veterinario</h4>
      {/* Contenido de visitas aquí */}
    </div>
  );
};
