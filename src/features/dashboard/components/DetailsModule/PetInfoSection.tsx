import type { Pet } from '../../../../models/pet.model';
import './PetInfoSection.scss';

interface PetInfoSectionProps {
  pet: Pet;
}

export default function PetInfoSection({ pet }: PetInfoSectionProps) {
  return (
    <div className="pet-info-box">
      <h3>Información General</h3>
      <p>Detalles completos de tu mascota</p>
      <div className="info-grid">
        <div>
          <label>Nombre</label>
          <p>{pet.name}</p>
        </div>
        <div>
          <label>Especie</label>
          <p>{pet.species}</p>
        </div>
        <div>
          <label>Raza</label>
          <p>{pet.breed}</p>
        </div>
        <div>
          <label>Fecha de nacimiento</label>
          <p>{pet.birthDate}</p>
        </div>
        <div>
          <label>Edad</label>
          <p>{pet.ageYears} años</p>
        </div>
        <div>
          <label>Peso</label>
          <p>{pet.weightKg} kg</p>
        </div>
        <div>
          <label>Sexo</label>
          <p>{pet.sex}</p>
        </div>
        <div>
          <label>Estado de Salud</label>
          <p>{pet.healthStatus ?? 'N/A'}</p>
        </div>
      </div>
      <div className="notes">
        <label>Notas</label>
        <p>{pet.notes || 'Sin notas'}</p>
      </div>
      <div className="edit-btn">
        <button>Editar Información</button>
      </div>
    </div>
  );
}
