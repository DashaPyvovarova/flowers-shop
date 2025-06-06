'use client';

import { useEffect, useState } from 'react';
import OrderForm from './OrdersForm';
import { Order, getOrders, updateOrder, createOrder, deleteOrder } from 'lib/api/orders';
import { User, getUsers } from 'lib/api/users';

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getOrders().then(setOrders);
    getUsers().then(setUsers);
  }, []);

  const handleSave = async (order: Omit<Order, 'id'> & { id?: string }) => {
    if (order.id) {
      const updated = await updateOrder(order.id, order);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } else {
      const created = await createOrder(order);
      setOrders((prev) => [created, ...prev]);
    }
    setEditingOrder(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Замовлення</h2>
        <button
          onClick={
            () => {
              setIsAdding(true);
              setEditingOrder(null);
            }
          }
          className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
        >
          Додати замовлення
        </button>
      </div>

      {
        (isAdding || editingOrder) && (
          <OrderForm
            order={ editingOrder }
            users={ users }
            onCancel={
              () => {
                setEditingOrder(null);
                setIsAdding(false);
              }
            }
            onSave={ handleSave }
          />
        )
      }

      <ul className="space-y-3">
        {
          orders.map((order) => {
            const user = users.find((u) => u.id === order.userId);
            return (
              <li
                key={ order.id }
                className="p-4 bg-white rounded shadow flex justify-between items-start"
              >
                <div>
                  <p><strong>ID:</strong> { order.id }</p>
                  <p><strong>Користувач:</strong> { user?.login || user?.email || 'Невідомий' }</p>
                  <p><strong>Статус:</strong> { order.status }</p>
                  <p><strong>Сума:</strong> { order.totalPrice } грн</p>
                </div>
                <div className="space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={ () => setEditingOrder(order) }
                  >
                  Редагувати
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={ () => handleDelete(order.id) }
                  >
                  Видалити
                  </button>
                </div>
              </li>
            );
          })
        }
      </ul>
    </section>
  );
}
