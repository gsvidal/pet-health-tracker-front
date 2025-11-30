export interface Meal {
  id: string;
  petId: string;
  mealTime: string;
  description?: string | null;
  calories?: number | null;
  planId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MealInput {
  petId: string;
  date: string;
  time: string;
  type: string;
  food: string;
  quantity: string;
  notes: string;
}
