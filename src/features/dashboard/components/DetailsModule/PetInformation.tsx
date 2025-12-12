import { useState } from 'react';
import PetInfoSection from './PetInfoSection';
import type { Pet } from '../../../../models/pet.model';
import { useTranslation } from 'react-i18next';

import './PetInformation.scss';
import { PetNutritionSection } from './PetNutritionsSection';
import { PetHealthSection } from './PetHealthSection';
import { FaSyringe, FaInfoCircle } from 'react-icons/fa';
import { PiForkKnifeFill } from 'react-icons/pi';

interface PetInformationProps {
  pet: Pet;
}

export const PetInformation = ({ pet }: PetInformationProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'info' | 'health' | 'nutrition' | 'visit'>(
    'info',
  );
  return (
    <div className="pet-information">
      <div className="tabs">
        <button
          className={tab === 'info' ? 'active' : ''}
          onClick={() => setTab('info')}
        >
          <FaInfoCircle className="icon icon--pet-section" /> {t('pet.details.sections.info')}
        </button>
        <button
          className={tab === 'health' ? 'active' : ''}
          onClick={() => setTab('health')}
        >
          <FaSyringe className="icon icon--pet-section" />
          {t('pet.details.sections.health')}
        </button>
        <button
          className={tab === 'nutrition' ? 'active' : ''}
          onClick={() => setTab('nutrition')}
        >
          <PiForkKnifeFill className="icon icon--pet-section" />
          {t('pet.details.sections.nutrition')}
        </button>
      </div>

      {tab === 'info' && <PetInfoSection pet={pet} />}
      {tab === 'health' && <PetHealthSection pet={pet} />}
      {tab === 'nutrition' && <PetNutritionSection pet={pet} />}
    </div>
  );
};
