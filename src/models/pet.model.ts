export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  birthDate?: string | null;
  ageYears?: number | null;
  weightKg?: string | null;
  sex?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
export interface createPet {
  name: string;
  species: string;
  breed?: string | null;
  birthDate?: string | null;
  ageYears?: number | null;
  weightKg?: number | null;
  sex?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
}
