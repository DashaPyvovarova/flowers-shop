'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { CartItem } from 'basics/types/common.types';
import { successToast, warningToast } from 'basics/utils/toast';
import Cart from 'components/Cart';
import FlowerCard from 'components/FlowerCard';
import { Flower, getFlowers } from 'lib/api/flowers';
import { createOrderItem } from 'lib/api/orderItems';
import { createOrder, CreateOrderDTO } from 'lib/api/orders';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    getFlowers().then(setFlowers);
  }, []);

  function handleAdd(flower: Flower) {
    setCart((prev) => {
      const existing = prev.find((i) => i.flower.id === flower.id);
      if (existing) {
        return prev.map((i) => (i.flower.id === flower.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { flower, quantity: 1 }];
    });
  }

  function handleRemove(flowerId: string) {
    setCart((prev) => prev.filter((i) => i.flower.id !== flowerId));
  }

  async function handleConfirm() {
    if (!session || typeof session?.user?.id === undefined) {
      await router.push('/login');
      warningToast('Спочатку потрібно увійти');
      return;
    }

    if (cart.length === 0) {
      warningToast('Кошик порожній');
      return;
    }

    const orderItems = cart.map(({ flower, quantity }) => ({
      flowerId: flower.id,
      quantity,
      priceAtPurchase: flower.price.toString(),
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + parseFloat(item.priceAtPurchase) * item.quantity,
      0,
    );

    try {
      const newOrderData: CreateOrderDTO = {
        userId: session.user?.id as string,
        status: 'pending',
        totalPrice: totalPrice.toString(),
      };
      const order = await createOrder(newOrderData);

      await Promise.all(
        orderItems.map((item) => createOrderItem({
          orderId: order.id,
          flowerId: item.flowerId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })),
      );

      successToast('Замовлення створено!');
      setCart([]);
    } catch (error) {
      warningToast('Помилка при створенні замовлення');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-grow">
        {
          flowers.map((flower) => (
            <FlowerCard key={ flower.id } flower={ flower } onAdd={ handleAdd } />
          ))
        }
      </div>

      <Cart items={ cart } onConfirm={ () => handleConfirm() } onRemove={ handleRemove } />
    </div>
  );
}
