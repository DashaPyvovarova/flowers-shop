const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/reviews`;

export type Review = {
  id: string;
  userId: string;
  flowerId: string;
  rating: number;
  comment?: string | null;
};

export type CreateReviewDTO = {
  userId: string;
  flowerId: string;
  rating: number;
  comment?: string | null;
};

export async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get reviews');
  }
}

export async function getReviewById(id: string): Promise<Review> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get review');
  }
}

export async function createReview(data: CreateReviewDTO): Promise<Review> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to create review');
  }
}

export async function updateReview(id: string, data: Partial<CreateReviewDTO>): Promise<Review> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to update review');
  }
}

export async function deleteReview(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error();
  } catch {
    throw new Error('Failed to delete review');
  }
}
