export interface Vaccine {
  id: string;
  petId: string;
  vaccineName: string;
  manufacturer?: string | null;
  lotNumber?: string | null;
  dateAdministered: string;
  nextDue?: string | null;
  veterinarian?: string | null;
  notes?: string | null;
  proofDocumentId?: string | null;
  createdAt: string;
  updatedAt: string;
}
