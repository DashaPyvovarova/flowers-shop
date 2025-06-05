const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/orderItems`;

export type OrderItem = {
  id: string;
  orderId: string;
  flowerId: string;
  quantity: number;
  priceAtPurchase: string; // decimal as string
};

export type CreateOrderItemDTO = {
  orderId: string;
  flowerId: string;
  quantity: number;
  priceAtPurchase: string;
};

export async function getOrderItems(): Promise<OrderItem[]> {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get order items');
  }
}

export async function getOrderItemById(id: string): Promise<OrderItem> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get order item');
  }
}

export async function createOrderItem(data: CreateOrderItemDTO): Promise<OrderItem> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to create order item');
  }
}

export async function updateOrderItem(id: string, data: Partial<CreateOrderItemDTO>): Promise<OrderItem> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to update order item');
  }
}

export async function deleteOrderItem(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error();
  } catch {
    throw new Error('Failed to delete order item');
  }
}
