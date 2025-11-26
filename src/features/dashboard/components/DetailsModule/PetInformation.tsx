import { useState } from 'react';
import PetInfoSection from './PetInfoSection';
import type { Pet } from '../../../../models/pet.model';

interface PetInformationProps {
  pet: Pet;
}

export const PetInformation = ({ pet }: PetInformationProps) => {
  const [tab, setTab] = useState<'info' | 'vaccines' | 'nutrition' | 'visits'>(
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
          className={tab === 'vaccines' ? 'active' : ''}
          onClick={() => setTab('vaccines')}
        >
          Vacunas
        </button>
        <button
          className={tab === 'nutrition' ? 'active' : ''}
          onClick={() => setTab('nutrition')}
        >
          Nutrición
        </button>
        <button
          className={tab === 'visits' ? 'active' : ''}
          onClick={() => setTab('visits')}
        >
          Visitas
        </button>
      </div>

      {tab === 'info' && <PetInfoSection pet={pet} />}
      {/* Falta agregar tabs */}
    </div>
  );
};
