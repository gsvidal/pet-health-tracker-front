export interface Deworming {
  id: string;
  petId: string;
  medication?: string | null;
  dateAdministered: string;
  nextDue?: string | null;
  veterinarian?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

