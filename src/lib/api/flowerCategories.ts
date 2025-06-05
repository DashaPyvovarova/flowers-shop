const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/flowerCategories`;

export type FlowerCategory = {
  id: string;
  name: string;
};

export type CreateFlowerCategoryDTO = {
  name: string;
};

export async function getFlowerCategories(): Promise<FlowerCategory[]> {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get flower categories');
  }
}

export async function getFlowerCategoryById(id: string): Promise<FlowerCategory> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get flower category');
  }
}

export async function createFlowerCategory(data: CreateFlowerCategoryDTO): Promise<FlowerCategory> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to create flower category');
  }
}

export async function updateFlowerCategory(id: string, data: Partial<CreateFlowerCategoryDTO>): Promise<FlowerCategory> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to update flower category');
  }
}

export async function deleteFlowerCategory(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error();
  } catch {
    throw new Error('Failed to delete flower category');
  }
}
