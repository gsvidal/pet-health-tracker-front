// useMeal.ts
import { useEffect, useState } from 'react';
import type { Meal, MealInput } from '../models/meal.model';
import { getMeals, createMeal, updateMeal, deleteMeal } from '../services/meal.service';
import { usePetStore } from '../store/pet.store';

// Helper para formatear descripción de comida
function formatMealDescription(input: MealInput): string {
  const parts: string[] = [];
  
  if (input.type) {
    parts.push(input.type);
  }
  
  if (input.food) {
    if (parts.length > 0) {
      parts.push(`- ${input.food}`);
    } else {
      parts.push(input.food);
    }
  }
  
  if (input.quantity) {
    parts.push(`(${input.quantity})`);
  }
  
  let description = parts.join(' ');
  
  if (input.notes) {
    description += ` | ${input.notes}`;
  }
  
  return description || '';
}

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
        description: formatMealDescription(mealInput) || null,
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
  async function updateMealData(mealId: string, mealInput: MealInput) {
    if (mockMode) {
      const updatedMockMeal: Meal = {
        id: mealId,
        petId: mealInput.petId,
        mealTime: `${mealInput.date}T${mealInput.time}:00`,
        description: formatMealDescription(mealInput) || null,
        calories: null,
        planId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMeals((prev) =>
        prev.map((m) => (m.id === mealId ? updatedMockMeal : m)),
      );
      return;
    }
    const updatedMeal = await updateMeal(mealId, mealInput);
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? updatedMeal : m)),
    );
  }

  async function removeMeal(mealId: string) {
    if (mockMode) {
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
      return;
    }
    await deleteMeal(mealId);
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  }
  return { meals, loading, addMeal, updateMeal: updateMealData, removeMeal };
}
