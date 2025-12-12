import { useEffect } from 'react';
import { usePetStore } from '../store/pet.store';
import type { Pet } from '../models/pet.model';

interface UsePetDetails {
  pet: Pet | null;
  loading: boolean;
  error: string | null;
  refreshPet: () => Promise<void>;
}

export const usePetDetails = (petId: string): UsePetDetails => {
  const { selectedPet, fetchPetById, loading, error } = usePetStore();

  useEffect(() => {
    if (!petId) return;
    fetchPetById(petId);
  }, [petId, fetchPetById]);

  const refreshPet = async () => {
    await fetchPetById(petId);
  };

  return {
    pet: selectedPet,
    loading,
    error,
    refreshPet,
  };
};
