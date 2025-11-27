import type { Pet } from "../../../../models/pet.model";

interface PetVisitSectionProps {
  pet: Pet;
}

export const PetVisitSection:React.FC<PetVisitSectionProps> = () => {

  return <div className="pet-section-card">Seccion Visitas</div>;};
