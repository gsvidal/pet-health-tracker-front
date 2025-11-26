import type { Pet } from "../../../../models/pet.model";

interface PetNutritionSectionProps {
  pet: Pet;
}

export const PetNutritionSection:React.FC<PetNutritionSectionProps> = ({pet}) => {

  return <div className="pet-section-card">Seccion Nutricion</div>;
};
