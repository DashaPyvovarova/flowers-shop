'use client';

import { IKImage } from 'imagekitio-next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { config } from 'config/config';
import { getFlowers } from 'lib/api/flowers';
import { getOrderItems, OrderItem } from 'lib/api/orderItems';
import { getOrdersByUserId, Order } from 'lib/api/orders';

type OrderWithItems = Order & {
  items: (OrderItem & { flowerName: string; flowerImage: string })[];
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadOrders = async () => {
      const [userOrders, allItems, flowers] = await Promise.all([
        getOrdersByUserId(userId),
        getOrderItems(),
        getFlowers(),
      ]);

      const flowerMap = new Map(flowers.map((f) => [f.id, { name: f.name, image: f.image }]));

      const ordersWithItems: OrderWithItems[] = userOrders.map((order) => ({
        ...order,
        items: allItems
          .filter((item) => item.orderId === order.id)
          .map((item) => {
            const flower = flowerMap.get(item.flowerId);
            return {
              ...item,
              flowerName: flower?.name || 'Невідома квітка',
              flowerImage: flower?.image || '/no-image.jpg',
            };
          }),
      }));

      setOrders(ordersWithItems);
      setLoading(false);
    };

    loadOrders();
  }, [userId]);

  if (loading) return <p className="text-center py-12">Завантаження замовлень...</p>;

  if (!orders || orders.length === 0) {
    return <p className="text-center py-12 text-gray-500">У вас ще немає замовлень.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Мої замовлення</h1>
      <div className="space-y-6">
        {
          orders.map((order) => (
            <div key={ order.id } className="border rounded-2xl p-6 shadow-lg bg-white">
              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <span>
                Замовлення №{ ' ' }
                  <span className="font-medium text-black">{ order.id.slice(0, 8) }</span>
                </span>
                <span className="capitalize">
                Статус:{ ' ' }
                  <span className="font-semibold text-indigo-600">{ order.status }</span>
                </span>
              </div>

              <div className="space-y-4 mb-4">
                {
                  order.items.map((item) => (
                    <div
                      key={ item.id }
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"
                    >
                      <IKImage
                        urlEndpoint={ `${config.env.imagekit.urlEndpoint}/flowers` }
                        path={ item.flowerImage as string }
                        alt={ item.flowerName }
                        width={ 56 }
                        height={ 56 }
                        className="w-14 h-14 rounded-xl object-cover border"
                      />
                      <div className="text-sm text-gray-800">
                        <div className="font-medium">{ item.flowerName }</div>
                        <div className="text-gray-600">{ item.quantity } шт.</div>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className="text-right font-semibold text-lg">
                { order.totalPrice } грн
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
