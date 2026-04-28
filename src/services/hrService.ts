
export interface Staff {
  id: string;
  userId: string;
  name: string;
  role: string;
  specialization: string;
  joinDate: string;
  salary: number;
  status: 'Active' | 'Inactive';
}

export interface Attendance {
  id: string;
  staffId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
}

export interface Shift {
  id: string;
  staffId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  reason: string;
}

export async function getStaff(): Promise<Staff[]> {
  const res = await fetch('/api/hr/staff');
  return res.json();
}

export async function addStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
  const res = await fetch('/api/hr/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(staff),
  });
  return res.json();
}

export async function getAttendance(): Promise<Attendance[]> {
  const res = await fetch('/api/hr/attendance');
  return res.json();
}

export async function checkIn(staffId: string): Promise<Attendance> {
  const res = await fetch('/api/hr/attendance/check-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staffId }),
  });
  return res.json();
}

export async function getShifts(): Promise<Shift[]> {
  const res = await fetch('/api/hr/shifts');
  return res.json();
}

export async function getLeaves(): Promise<LeaveRequest[]> {
  const res = await fetch('/api/hr/leaves');
  return res.json();
}

export async function requestLeave(leave: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> {
  const res = await fetch('/api/hr/leaves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leave),
  });
  return res.json();
}
