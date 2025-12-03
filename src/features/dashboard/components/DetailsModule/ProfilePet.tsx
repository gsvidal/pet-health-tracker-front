import './ProfilePet.scss';
import type { Pet } from '../../../../models/pet.model';
import { useRef, useState } from 'react';
import { FaEdit, FaSpinner } from 'react-icons/fa';
import { usePetStore } from '../../../../store/pet.store';

interface ProfilePetProps {
  pet: Pet;
}

export const ProfilePet = ({ pet }: ProfilePetProps) => {
  const photoUrl = pet.photoUrl || '/default-pet.png';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { uploadPetPhoto, loading } = usePetStore();

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
            <div className="avatar-initial">{pet.name?.[0] ?? '?'}</div>
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
