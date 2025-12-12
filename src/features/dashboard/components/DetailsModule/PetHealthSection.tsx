import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../../../../models/pet.model';
import './PetHealthSection.scss';
import { PetVaccinationSubsection } from './PetHealthSubsections/PetVaccinationSubsection';
import { PetDewormingSubsection } from './PetHealthSubsections/PetDewormingSubsection';
import { PetVisitSubsection } from './PetHealthSubsections/PetVisitSubsection';

interface PetHealthSectionProps {
  pet: Pet;
}

export const PetHealthSection: React.FC<PetHealthSectionProps> = ({ pet }) => {
  const { t } = useTranslation();
  const [subsection, setSubsection] = useState<
    'vaccination' | 'deworming' | 'visit'
  >('vaccination');

  return (
    <div className="pet-health-section">
      <div className="subsections-tabs">
        <button
          className={subsection === 'vaccination' ? 'active' : ''}
          onClick={() => setSubsection('vaccination')}
        >
          {t('pet.details.subsections.vaccination')}
        </button>
        <button
          className={subsection === 'deworming' ? 'active' : ''}
          onClick={() => setSubsection('deworming')}
        >
          {t('pet.details.subsections.deworming')}
        </button>
        <button
          className={subsection === 'visit' ? 'active' : ''}
          onClick={() => setSubsection('visit')}
        >
          {t('pet.details.subsections.visit')}
        </button>
      </div>

      {subsection === 'vaccination' && <PetVaccinationSubsection pet={pet} />}
      {subsection === 'deworming' && <PetDewormingSubsection pet={pet} />}
      {subsection === 'visit' && <PetVisitSubsection pet={pet} />}
    </div>
  );
};
