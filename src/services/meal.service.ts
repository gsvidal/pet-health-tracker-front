import { apiClient } from './api.config';
import type { Meal, MealInput } from '../models/meal.model';
import type { MealResponse } from '../adapters/meal.adapter';
import { adaptMealResponseToMeal } from '../adapters/meal.adapter';

// Normalizador — convierte MealInput al formato backend real
function normalizeMealInput(input: MealInput) {
  return {
    pet_id: input.petId,
    meal_time: `${input.date}T${input.time}:00`,
    description: `${input.type} - ${input.food} (${input.quantity})${input.notes ? ` | ${input.notes}` : ''}`,
    calories: null,
    plan_id: null,
  };
}

// Traer comidas del backend
export async function getMeals(): Promise<Meal[]> {
  const res = await apiClient.get(`/meals/`);
  return (res.data as MealResponse[]).map(adaptMealResponseToMeal);
}

// Crear comida real
export async function createMeal(mealInput: MealInput): Promise<Meal> {
  const payload = normalizeMealInput(mealInput);
  const res = await apiClient.post(`/meals`, payload);
  const backendMeal = res.data;
  const now = new Date().toISOString();
  return {
    id: backendMeal.id ?? crypto.randomUUID(),
    petId: backendMeal.pet_id,
    pet_id: backendMeal.pet_id,
    mealTime: backendMeal.meal_time,
    description: backendMeal.description ?? null,
    calories: backendMeal.calories ?? null,
    planId: backendMeal.plan_id ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

// Eliminar comida
export async function deleteMeal(mealId: string): Promise<void> {
  await apiClient.delete(`/meals/${mealId}`);
}
