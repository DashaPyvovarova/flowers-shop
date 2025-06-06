const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/addresses`;

export type Address = {
  id: string;
  userId: string;
  city: string;
  street: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type CreateAddressDTO = Omit<Address, 'id' | 'isDefault'> & {
  isDefault?: boolean;
};

export async function getAddresses(): Promise<Address[]> {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get addresses');
  }
}

export async function getAddressById(id: string): Promise<Address> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to get address');
  }
}

export async function getAddressByUserId(userId: string): Promise<Address | null> {
  try {
    const addresses = await getAddresses();
    return addresses.find((address) => address.userId === userId) || null;
  } catch {
    throw new Error('Не вдалося отримати адресу користувача');
  }
}

export async function createAddress(data: CreateAddressDTO): Promise<Address> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to create address');
  }
}

export async function updateAddress(id: string, data: Partial<CreateAddressDTO>): Promise<Address> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    throw new Error('Failed to update address');
  }
}

export async function deleteAddress(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error();
  } catch {
    throw new Error('Failed to delete address');
  }
}
