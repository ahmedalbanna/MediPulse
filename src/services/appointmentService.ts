export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' | 'Checked-in' | 'Waiting' | 'In-Progress' | 'No-show';
  priority?: 'Low' | 'Medium' | 'High' | 'Emergency';
  room?: string;
  notes?: string;
}

export async function getAppointments() {
  const response = await fetch('/api/appointments');
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json() as Promise<Appointment[]>;
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  const response = await fetch(`/api/appointments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update appointment');
  }
  return response.json() as Promise<Appointment>;
}

export async function addAppointment(appointment: Omit<Appointment, 'id'>) {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointment),
  });
  if (!response.ok) {
    throw new Error('Failed to schedule appointment');
  }
  return response.json() as Promise<Appointment>;
}

export async function deleteAppointment(id: string) {
  const response = await fetch(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to cancel appointment');
  }
  return true;
}
