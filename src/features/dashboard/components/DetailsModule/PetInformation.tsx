import { useState } from 'react';
import PetInfoSection from './PetInfoSection';
import type { Pet } from '../../../../models/pet.model';

import './PetInformation.scss';
import { PetNutritionSection } from './PetNutritionsSection';
import { PetVisitSection } from './PetVisitSection';
import { PetVaccineSection } from './PetVaccineSection';
import { CiCircleInfo } from 'react-icons/ci';
import { TbVaccine } from 'react-icons/tb';
import { LuUtensilsCrossed } from 'react-icons/lu';
import { FaRegCalendar } from 'react-icons/fa';

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
          <p id="menu-title">
            <CiCircleInfo className="icon-tabs" size={15} />
            Información
          </p>
        </button>
        <button
          className={tab === 'vaccines' ? 'active' : ''}
          onClick={() => setTab('vaccines')}
        >
          <p id="menu-title">
            <TbVaccine className="icon-tabs" size={15} />
            Vacunas
          </p>
        </button>
        <button
          className={tab === 'nutrition' ? 'active' : ''}
          onClick={() => setTab('nutrition')}
        >
          <p id="menu-title">
            <LuUtensilsCrossed className="icon-tabs" size={15} />
            Nutrición
          </p>
        </button>
        <button
          className={tab === 'visits' ? 'active' : ''}
          onClick={() => setTab('visits')}
        >
          <p id="menu-title">
            <FaRegCalendar className="icon-tabs" size={15} />
            Visitas
          </p>
        </button>
      </div>

      {tab === 'info' && <PetInfoSection pet={pet} />}
      {tab === 'vaccines' && <PetVaccineSection pet={pet} />}
      {tab === 'nutrition' && <PetNutritionSection pet={pet} />}
      {tab === 'visits' && <PetVisitSection pet={pet} />}
    </div>
  );
};
