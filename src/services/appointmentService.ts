export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
}

export async function getAppointments() {
  const response = await fetch('/api/appointments');
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json() as Promise<Appointment[]>;
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
