export interface VetVisit {
  id: string;
  petId: string;
  visitDate: string;
  reason?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  followUpDate?: string | null;
  veterinarian?: string | null;
  documentsId?: string | null;
  createdAt: string;
  updatedAt: string;
}

