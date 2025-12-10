import './ProfilePet.scss';
import type { Pet } from '../../../../models/pet.model';
import { useRef, useState } from 'react';
import { FaEdit, FaSpinner } from 'react-icons/fa';
import { usePetStore } from '../../../../store/pet.store';
import { usePetHealthStatus } from '../../../../hooks/usePetHealthStatus';
import type { HealthStatusData } from '../../../../utils/healthStatus';
import type { PetHealthSummary } from '../../../../adapters/pet.adapter';

interface ProfilePetProps {
  pet: Pet;
  healthStatusData?: HealthStatusData & {
    loading: boolean;
    summary: PetHealthSummary | null;
  };
}

export const ProfilePet = ({
  pet,
  healthStatusData: propHealthStatusData,
}: ProfilePetProps) => {
  const photoUrl = pet.photoUrl || '/default-pet.png';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { uploadPetPhoto, loading } = usePetStore();
  const hookHealthStatus = usePetHealthStatus({
    petId: pet.id,
  });

  // Usar el prop si está disponible, sino usar el hook
  const { status, loading: healthLoading } =
    propHealthStatusData || hookHealthStatus;

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
      e.target.value = ''; // Limpiar el input
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Formato no válido. Solo se permiten: JPG, PNG, GIF, WEBP');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      await uploadPetPhoto(pet.id || '', file);
    } catch (error) {
      console.error('Error al subir foto:', error);
    } finally {
      setUploading(false);
      e.target.value = ''; // Limpiar el input después de subir
    }
  };

  return (
    <div className="profile-pet-card">
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar">
          {pet.photoUrl ? (
            <img src={photoUrl} alt={pet.name} className="pet-profile-photo" />
          ) : (
            <div className="avatar-initial">
              {pet.name?.[0].toLocaleUpperCase() ?? '?'}
            </div>
          )}
        </div>
        <button
          type="button"
          className="profile-avatar__edit-btn"
          onClick={handleEditClick}
          disabled={uploading || loading}
          aria-label="Editar foto de perfil"
        >
          {uploading || loading ? (
            <FaSpinner className="spinner" />
          ) : (
            <FaEdit />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Seleccionar foto de perfil"
        />
      </div>
      <div className="profile-info">
        <h2>{pet.name}</h2>
        <p>
          {pet.species} • {pet.breed}
        </p>
        <div className="profile-stats">
          <div>
            <strong>Edad:</strong> <p>{pet.ageYears} años</p>
          </div>
          <div>
            <strong>Peso:</strong> <p>{pet.weightKg} kg</p>
          </div>
          <div>
            <strong>Sexo:</strong> <p>{pet.sex}</p>
          </div>
          <div>
            <strong>Estado:</strong>
            <span
              className={`health-badge health-badge--${
                healthLoading
                  ? 'loading'
                  : status === 'Saludable'
                    ? 'saludable'
                    : status === 'Atención Requerida'
                      ? 'atencion-requerida'
                      : 'revision-necesaria'
              }`}
            >
              {healthLoading ? 'Cargando...' : status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
