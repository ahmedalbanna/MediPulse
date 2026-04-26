export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Nurse' | 'Patient';
  department: string;
  status: 'Active' | 'Inactive';
  permissions: string[];
}

export async function getUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json() as Promise<User[]>;
}

export async function createUser(user: Omit<User, 'id'>) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json() as Promise<User>;
}

export async function updateUser(id: string, user: Partial<User>) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json() as Promise<User>;
}

export async function deleteUser(id: string) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete user');
}
