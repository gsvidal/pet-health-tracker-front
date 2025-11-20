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

