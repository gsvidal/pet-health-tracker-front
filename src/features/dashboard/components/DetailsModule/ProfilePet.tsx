import './ProfilePet.scss';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../../../../models/pet.model';
import { useRef, useState } from 'react';
import { FaEdit, FaSpinner } from 'react-icons/fa';
import { Upload, Images } from 'lucide-react';
import { usePetStore } from '../../../../store/pet.store';
import { usePetHealthStatus } from '../../../../hooks/usePetHealthStatus';
import type { HealthStatusData } from '../../../../utils/healthStatus';
import type { PetHealthSummary } from '../../../../adapters/pet.adapter';
import { Button } from '../../../../components/Button/Button';
import { useGalleryModalStore } from '../../../../store/gallery.store';
import { getPetPhotos } from '../../../../services/pet.service';
import { formatPetAge } from '../../../../utils/dateUtils';
import { translateHealthStatus } from '../../../../utils/healthStatusTranslations';
import { getSexLabel } from '../../../../utils/sexUtils';
import { getSpeciesLabel } from '../../../../utils/speciesUtils';
import toast from 'react-hot-toast';

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
  const { t } = useTranslation();
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

  const translatedStatus = translateHealthStatus(status);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(t('gallery.fileTooLarge'));
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
      toast.error(t('gallery.invalidFormat'));
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

  const openUpload = useGalleryModalStore((s) => s.openUpload);
  const openView = useGalleryModalStore((s) => s.openView);

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
          aria-label={t('pet.details.uploadPhoto')}
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
          aria-label={t('pet.details.uploadPhoto')}
        />
      </div>
      <div className="profile-pet-card__actions">
        <Button
          variant="outline"
          // className="profile-action-btn profile-action-btn--upload"
          onClick={() => openUpload(pet.id)}
        >
          <Upload size={18} style={{ marginRight: '1rem' }} />
          <span>{t('pet.details.uploadGallery')}</span>
        </Button>

        <Button
          // className="profile-action-btn profile-action-btn--gallery"
          variant="outline"
          onClick={async () => {
            const photos = await getPetPhotos(pet.id);
            if (!photos || photos.length === 0) {
              toast.error(t('gallery.empty'));
              return;
            }
            openView(pet.id, photos);
          }}
        >
          <Images size={18} style={{ marginRight: '1rem' }} />
          <span>{t('pet.details.viewGallery')}</span>
        </Button>
      </div>
      <div className="profile-info">
        <h2>{pet.name}</h2>
        <p>
          {getSpeciesLabel(pet.species)} • {pet.breed}
        </p>
        <div className="profile-stats">
          <div>
            <strong>{t('pet.card.age')}:</strong>{' '}
            <p>{formatPetAge(pet.ageYears)}</p>
          </div>
          <div>
            <strong>{t('common.weight')}:</strong>{' '}
            <p>
              {pet.weightKg} {t('common.kg')}
            </p>
          </div>
          <div>
            <strong>{t('pet.form.sex')}:</strong>{' '}
            <p>{getSexLabel(pet.sex) || '—'}</p>
          </div>
          <div>
            <strong>{t('pet.card.healthStatus')}:</strong>
            <span
              className={`health-badge health-badge--${
                healthLoading
                  ? 'loading'
                  : status === 'healthy'
                    ? 'saludable'
                    : status === 'attention_required'
                      ? 'atencion-requerida'
                      : 'revision-necesaria'
              }`}
            >
              {healthLoading ? t('common.loading') : translatedStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
