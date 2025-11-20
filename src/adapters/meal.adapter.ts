import type { Meal } from '../models/meal.model';

/**
 * Schema del backend (snake_case)
 */
export interface MealResponse {
  id: string;
  pet_id: string;
  meal_time: string;
  description?: string | null;
  calories?: number | null;
  plan_id?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Adapta MealResponse del backend (snake_case) a Meal del frontend (camelCase)
 */
export function adaptMealResponseToMeal(mealResponse: MealResponse): Meal {
  return {
    id: mealResponse.id,
    petId: mealResponse.pet_id,
    mealTime: mealResponse.meal_time,
    description: mealResponse.description,
    calories: mealResponse.calories,
    planId: mealResponse.plan_id,
    createdAt: mealResponse.created_at,
    updatedAt: mealResponse.updated_at,
  };
}
