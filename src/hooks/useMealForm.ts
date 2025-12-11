import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { MealInput, Meal } from '../models/meal.model';

export interface MealFormState {
  date: string;
  time: string;
  type: string;
  food: string;
  quantity: string;
  notes: string;
}

interface UseMealFormProps {
  onSave: (data: MealInput) => Promise<void>;
  onSuccess?: () => void;
  petId: string;
  editingMeal?: Meal | null;
}

export const useMealForm = ({
  onSave,
  onSuccess,
  petId,
  editingMeal,
}: UseMealFormProps) => {
  const today = new Date().toISOString().split('T')[0];
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    control,
  } = useForm<MealFormState>({
    mode: 'onChange',
    defaultValues: {
      date: today,
      time: '',
      type: '',
      food: '',
      quantity: '',
      notes: '',
    },
  });

  // Cargar datos de comida en modo edición
  useEffect(() => {
    if (editingMeal) {
      const mealDateTime = new Date(editingMeal.mealTime);
      setValue('date', mealDateTime.toISOString().split('T')[0]);
      setValue('time', mealDateTime.toTimeString().slice(0, 5));

      // Parsear description: "Tipo - Alimento (Cantidad) | Notas"
      if (editingMeal.description) {
        const descParts = editingMeal.description.split(' | ');
        const mainPart = descParts[0];
        const notes = descParts[1] || '';

        const match = mainPart.match(/^(.+?)\s*-\s*(.+?)\s*\((.+?)\)$/);
        if (match) {
          setValue('type', match[1].trim());
          setValue('food', match[2].trim());
          setValue('quantity', match[3].trim());
        } else {
          // Si no coincide el formato, poner todo en food
          setValue('food', mainPart);
        }
        setValue('notes', notes);
      }
    } else {
      reset();
    }
  }, [editingMeal, setValue, reset]);

  const onSubmit = async (data: MealFormState) => {
    const formData: MealInput = {
      petId,
      date: data.date,
      time: data.time,
      type: data.type,
      food: data.food,
      quantity: data.quantity,
      notes: data.notes,
    };

    try {
      await onSave(formData);
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Error al guardar comida:', err);
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
    setValue,
    control,
  };
};
