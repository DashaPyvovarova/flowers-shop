const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/flowers`;

export type Flower = {
  id: string;
  name: string;
  description: string | null;
  price: string; // decimal as string
  stock: number;
  image: string | null;
  categoryId: string;
};

export type CreateFlowerDTO = {
  name: string;
  description?: string | null;
  price: string;
  stock: number;
  image?: string | null;
  categoryId: string;
};

export async function getFlowers(): Promise<Flower[]> {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get flowers');
  }
}

export async function getFlowerById(id: string): Promise<Flower> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get flower');
  }
}

export async function createFlower(data: CreateFlowerDTO): Promise<Flower> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to create flower');
  }
}

export async function updateFlower(id: string, data: Partial<CreateFlowerDTO>): Promise<Flower> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to update flower');
  }
}

export async function deleteFlower(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error();
  } catch {
    throw new Error('Failed to delete flower');
  }
}
