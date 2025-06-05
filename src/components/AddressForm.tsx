'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { successToast, warningToast } from 'basics/utils/toast';
import {
  Address,
  createAddress,
  getAddressByUserId,
  updateAddress,
} from 'lib/api/addresses';

export type UpdateAddressDTO = Omit<Address, 'id' | 'userId'>;

export default function AddressForm() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id as string;
  const [form, setForm] = useState<UpdateAddressDTO>({
    street: '',
    city: '',
    country: '',
    postalCode: '',
    isDefault: true,
  });
  const [addressId, setAddressId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;
    getAddressByUserId(currentUserId)
      .then((address) => {
        if (address) {
          const { id, userId, ...rest } = address;
          setForm(rest);
          setAddressId(id);
        }
      })
      .finally(() => setLoading(false));
  }, [currentUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      if (!currentUserId) return;

      if (!addressId) {
        const newAddress = await createAddress({
          ...form,
          userId: currentUserId,
        });
        setAddressId(newAddress.id);
        successToast('Адресу створено');
      } else {
        await updateAddress(addressId, form);
        successToast('Адресу оновлено');
      }
    } catch {
      warningToast('Помилка при збереженні адреси');
    }
  };

  if (loading) return <div className="text-center text-gray-500">Завантаження адреси...</div>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl border w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Адреса доставки</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Вулиця</span>
          <input
            name="street"
            value={ form.street }
            onChange={ handleChange }
            className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Місто</span>
          <input
            name="city"
            value={ form.city }
            onChange={ handleChange }
            className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Поштовий індекс</span>
          <input
            name="postalCode"
            value={ form.postalCode }
            onChange={ handleChange }
            className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Країна</span>
          <input
            name="country"
            value={ form.country }
            onChange={ handleChange }
            className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={ form.isDefault }
            onChange={ handleChange }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Адреса за замовчуванням</span>
        </label>
        <button
          onClick={ handleSubmit }
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          { addressId ? 'Оновити адресу' : 'Зберегти адресу' }
        </button>
      </div>
    </div>
  );
}
