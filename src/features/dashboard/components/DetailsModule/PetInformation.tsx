import { useState } from 'react';
import PetInfoSection from './PetInfoSection';
import type { Pet } from '../../../../models/pet.model';

import './PetInformation.scss';
import { PetNutritionSection } from './PetNutritionsSection';
import { PetHealthSection } from './PetHealthSection';

interface PetInformationProps {
  pet: Pet;
}

export const PetInformation = ({ pet }: PetInformationProps) => {
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
          Información
        </button>
        <button
          className={tab === 'health' ? 'active' : ''}
          onClick={() => setTab('health')}
        >
          Salud
        </button>
        <button
          className={tab === 'nutrition' ? 'active' : ''}
          onClick={() => setTab('nutrition')}
        >
          Nutrición
        </button>
      </div>

      {tab === 'info' && <PetInfoSection pet={pet} />}
      {tab === 'health' && <PetHealthSection pet={pet} />}
      {tab === 'nutrition' && <PetNutritionSection pet={pet} />}
    </div>
  );
};
