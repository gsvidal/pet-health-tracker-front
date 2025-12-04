import { apiClient } from './api.config';
import type { Meal, MealInput } from '../models/meal.model';
import type { MealResponse } from '../adapters/meal.adapter';
import { adaptMealResponseToMeal } from '../adapters/meal.adapter';

// Normalizador — convierte MealInput al formato backend real
function normalizeMealInput(input: MealInput) {
  // Construir descripción de forma inteligente
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

  return {
    pet_id: input.petId,
    meal_time: `${input.date}T${input.time}:00`,
    description: description || null,
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

// Actualizar comida
export async function updateMeal(
  mealId: string,
  mealInput: MealInput,
): Promise<Meal> {
  const payload = normalizeMealInput(mealInput);
  const res = await apiClient.put(`/meals/${mealId}`, payload);
  const backendMeal = res.data;
  return {
    id: backendMeal.id ?? mealId,
    petId: backendMeal.pet_id,
    pet_id: backendMeal.pet_id,
    mealTime: backendMeal.meal_time,
    description: backendMeal.description ?? null,
    calories: backendMeal.calories ?? null,
    planId: backendMeal.plan_id ?? null,
    createdAt: backendMeal.created_at ?? new Date().toISOString(),
    updatedAt: backendMeal.updated_at ?? new Date().toISOString(),
  };
}

// Eliminar comida
export async function deleteMeal(mealId: string): Promise<void> {
  await apiClient.delete(`/meals/${mealId}`);
}
