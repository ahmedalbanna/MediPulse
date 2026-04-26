export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  status: 'Critical' | 'Stable' | 'Recovering';
  contact: string;
  address?: string;
  history?: { date: string, status: string, note: string }[];
  notes?: string[];
  medications?: Medication[];
}

export async function getPatients(
  page: number = 1, 
  pageSize: number = 5, 
  sortBy: keyof Patient = 'name', 
  sortOrder: 'asc' | 'desc' = 'asc',
  filters?: { status?: string, minAge?: string, maxAge?: string, lastVisit?: string }
) {

  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
    sortBy: sortBy as string,
    sortOrder
  });

  if (filters) {
    if (filters.status) params.append('status', filters.status);
    if (filters.minAge) params.append('minAge', filters.minAge);
    if (filters.maxAge) params.append('maxAge', filters.maxAge);
    if (filters.lastVisit) params.append('lastVisit', filters.lastVisit);
  }

  const response = await fetch(`/api/patients?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch patients from API');
  }
  
  return response.json();
}

export async function getAllPatients() {
  const response = await fetch('/api/patients/all');
  if (!response.ok) {
    throw new Error('Failed to fetch all patients');
  }
  return response.json();
}

export async function updatePatient(id: string, data: Partial<Patient>) {
  const response = await fetch(`/api/patients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update patient');
  }

  return response.json();
}

export async function addPatient(data: Omit<Patient, 'id'>) {
  const response = await fetch('/api/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to add patient');
  }

  return response.json();
}

