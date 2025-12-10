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
    formState: { errors, isValid, isDirty },
    reset,
    watch,
    control,
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
      // Usar reset en lugar de setValue para que no marque el formulario como dirty
      reset({
        name: editingPet.name || '',
        species: editingPet.species || '',
        breed: editingPet.breed || '',
        birthDate: editingPet.birthDate
          ? editingPet.birthDate.split('T')[0]
          : '',
        ageYears: editingPet.ageYears ? String(editingPet.ageYears) : '',
        weightKg: editingPet.weightKg ? String(editingPet.weightKg) : '',
        sex: editingPet.sex || '',
        photoUrl: editingPet.photoUrl || '',
        notes: editingPet.notes || '',
      });
    } else {
      reset();
    }
  }, [editingPet, reset]);

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
    isDirty,
    onSubmit,
    handleCancel,
    watch,
    control,
  };
};
