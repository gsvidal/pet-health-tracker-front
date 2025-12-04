import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { Pet } from '../models/pet.model';
import type { PetFormData } from '../adapters/pet.adapter';

export interface PetFormState {
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  ageYears: string;
  weightKg: string;
  sex: string;
  photoUrl: string;
  notes: string;
}

interface UsePetFormProps {
  editingPet?: Pet | null;
  onSave: (data: PetFormData) => Promise<void>;
  onSuccess?: () => void;
}

export const usePetForm = ({
  editingPet,
  onSave,
  onSuccess,
}: UsePetFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<PetFormState>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      birthDate: '',
      ageYears: '',
      weightKg: '',
      sex: '',
      photoUrl: '',
      notes: '',
    },
  });

  // Cargar datos de mascota en modo edición
  useEffect(() => {
    if (editingPet) {
      setValue('name', editingPet.name || '');
      setValue('species', editingPet.species || '');
      setValue('breed', editingPet.breed || '');
      setValue(
        'birthDate',
        editingPet.birthDate ? editingPet.birthDate.split('T')[0] : '',
      );
      setValue(
        'ageYears',
        editingPet.ageYears ? String(editingPet.ageYears) : '',
      );
      setValue(
        'weightKg',
        editingPet.weightKg ? String(editingPet.weightKg) : '',
      );
      setValue('sex', editingPet.sex || '');
      setValue('photoUrl', editingPet.photoUrl || '');
      setValue('notes', editingPet.notes || '');
    } else {
      reset();
    }
  }, [editingPet, setValue, reset]);

  const onSubmit = async (data: PetFormState) => {
    const formData: PetFormData = {
      name: data.name.trim(),
      species: data.species.trim(),
      breed: data.breed.trim() || null,
      birthDate: data.birthDate.trim() || null,
      ageYears: data.ageYears.trim() ? Number(data.ageYears) : null,
      weightKg: data.weightKg.trim() || null,
      sex: data.sex.trim() || null,
      photoUrl: data.photoUrl.trim() || null,
      notes: data.notes.trim() || null,
    };
    try {
      await onSave(formData);
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Error al guardar mascota:', err);
    }
  };

  const handleCancel = () => {
    reset();
    onSuccess?.();
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    watch,
  };
};
