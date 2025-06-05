const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/orders`;

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  totalPrice: string;
  status: OrderStatus;
};

export type CreateOrderDTO = {
  userId: string;
  status: OrderStatus;
  totalPrice: string;
};

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get orders');
  }
}

export async function getOrderById(id: string): Promise<Order> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get order');
  }
}

export async function createOrder(data: CreateOrderDTO): Promise<Order> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to create order');
  }
}

export async function updateOrder(id: string, data: Partial<CreateOrderDTO>): Promise<Order> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to update order');
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error();
  } catch {
    throw new Error('Failed to delete order');
  }
}
