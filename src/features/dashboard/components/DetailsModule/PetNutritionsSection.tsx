import type { Pet } from "../../../../models/pet.model";

interface PetNutritionSectionProps {
  pet: Pet;
}

export const PetNutritionSection:React.FC<PetNutritionSectionProps> = () => {

  return <div className="pet-section-card">Seccion Nutricion</div>;
};
