import './ProfilePet.scss';
import type { Pet } from '../../../../models/pet.model';

interface ProfilePetProps {
  pet: Pet;
}

export const ProfilePet = ({ pet }: ProfilePetProps) => {
  const photoUrl = pet.photoUrl?.[0] || '/default-pet.png';

  return (
    <div className="profile-pet-card">
      <div className="profile-avatar">
        {pet.photoUrl ? (
          <img src={photoUrl} alt={pet.name} className="pet-profile-photo" />
        ) : (
          <div className="avatar-initial">{pet.name?.[0] ?? '?'}</div>
        )}
      </div>
      <div className="profile-info">
        <h2>{pet.name}</h2>
        <p>
          {pet.species} • {pet.breed}
        </p>
        <div className="profile-stats">
          <div>
            <strong>Edad:</strong> {pet.ageYears} años
          </div>
          <div>
            <strong>Peso:</strong> {pet.weightKg} kg
          </div>
          <div>
            <strong>Sexo:</strong> {pet.sex}
          </div>
          <div>
            <strong>Estado:</strong>
            <span className="health-badge">Saludable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
