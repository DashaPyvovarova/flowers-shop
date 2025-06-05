import { hash } from 'bcryptjs';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/users`;

export type User = {
  id: string;
  login: string;
  email: string;
  password: string;
  role: string;
};

export type CreateUserDTO = {
  login: string;
  email: string;
  password: string;
  role: string;
};

export async function getUsers(): Promise<User[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function createUser(data: CreateUserDTO): Promise<User> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id: string, data: Partial<CreateUserDTO>): Promise<User> {
  let hashedPassword = data.password;

  if (data.password) {
    hashedPassword = await hash(data.password, 10);
  }
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      password: hashedPassword,
    }),
  });
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('User not found');
}
