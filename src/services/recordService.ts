export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  type: 'Laboratory' | 'Radiology' | 'Prescription' | 'Note';
  title: string;
  date: string;
  status: 'Final' | 'Draft' | 'Pending' | 'Active';
  doctor: string;
  department: string;
  fileSize: string;
}

export async function getMedicalRecords(filters?: { patientId?: string, type?: string }) {
  const params = new URLSearchParams();
  if (filters?.patientId) params.append('patientId', filters.patientId);
  if (filters?.type) params.append('type', filters.type);

  const response = await fetch(`/api/records?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch medical records');
  }
  return response.json() as Promise<MedicalRecord[]>;
}
