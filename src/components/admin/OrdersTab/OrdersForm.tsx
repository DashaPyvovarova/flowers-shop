'use client';

import { useState } from 'react';
import { Order, OrderStatus } from 'lib/api/orders';
import { User } from 'lib/api/users';

type Props = {
  order: Order | null;
  users: User[];
  onCancel: () => void;
  onSave: (order: Omit<Order, 'id'> & { id?: string }) => void;
};

export default function OrderForm({ order, users, onCancel, onSave }: Props) {
  const [userId, setUserId] = useState(order?.userId || (users[0]?.id ?? ''));
  const [status, setStatus] = useState(order?.status || 'pending');
  const [totalPrice, setTotalPrice] = useState(order?.totalPrice || '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: order?.id,
      userId,
      status,
      totalPrice,
    });
  };

  return (
    <form onSubmit={ handleSubmit } className="mb-6 p-4 bg-white rounded shadow max-w-md mx-auto space-y-4">
      <h3 className="text-lg font-semibold">{ order ? 'Редагувати замовлення' : 'Додати замовлення' }</h3>

      <label className="block">
        <span className="text-sm text-gray-700">Користувач</span>
        <select
          value={ userId }
          onChange={ (e) => setUserId(e.target.value) }
          className="w-full p-2 border rounded"
          required
        >
          {
            users.map((user) => (
              <option key={ user.id } value={ user.id }>
                { user.login || user.email || user.id }
              </option>
            ))
          }
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Статус</span>
        <select
          value={ status }
          onChange={ (e) => setStatus(e.target.value as OrderStatus) }
          className="w-full p-2 border rounded"
          required
        >
          <option value="pending">Обробляється</option>
          <option value="shipped">Відправлено</option>
          <option value="delivered">Доставлено</option>
          <option value="cancelled">Скасовано</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Сума (грн)</span>
        <input
          type="number"
          value={ totalPrice }
          onChange={ (e) => setTotalPrice(e.target.value) }
          min={ 0 }
          step={ 0.01 }
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={ onCancel }
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Відмінити
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
        >
          Зберегти
        </button>
      </div>
    </form>
  );
}
