// useMeal.ts
import { useEffect, useState } from 'react';
import type { Meal, MealInput } from '../models/meal.model';
import { getMeals, createMeal, deleteMeal } from '../services/meal.service';
import { usePetStore } from '../store/pet.store';

const MOCK_MEALS: Meal[] = [
  {
    id: 'mock-meal-1',
    petId: 'mock-pet-1',
    mealTime: '2025-01-01T10:00:00Z',
    description: 'Comida Mock - Croquetas 150g',
    calories: 200,
    planId: null,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
];

export function useMeals(petId: string) {
  const { mockMode } = usePetStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      setLoading(true);
      if (mockMode) {
        const filtered = MOCK_MEALS.filter((m) => m.petId === petId);
        setMeals(filtered);
        setLoading(false);
        return;
      }
      const data = await getMeals();
      const filtered = data.filter((m) => m.petId === petId);
      setMeals(filtered);
      setLoading(false);
    }
    load();
  }, [petId, mockMode]);

  async function addMeal(mealInput: MealInput) {
    if (mockMode) {
      const newMockMeal: Meal = {
        id: crypto.randomUUID(),
        petId: mealInput.petId,
        mealTime: `${mealInput.date}T${mealInput.time}:00`,
        description: `${mealInput.type} - ${mealInput.food} (${mealInput.quantity})${mealInput.notes ? ` | ${mealInput.notes}` : ''}`,
        calories: null,
        planId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMeals((prev) => [newMockMeal, ...prev]);
      return;
    }
    const newMeal = await createMeal(mealInput);
    setMeals((prev) => [newMeal, ...prev]);
  }
  async function removeMeal(mealId: string) {
    if (mockMode) {
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
      return;
    }
    await deleteMeal(mealId);
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  }
  return { meals, loading, addMeal, removeMeal };
}
