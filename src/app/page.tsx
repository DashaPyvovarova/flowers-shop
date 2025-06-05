'use client';

import { IKImage } from 'imagekitio-next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { config } from '../config/config';
import { FlowerCategory, getFlowerCategories } from 'lib/api/flowerCategories';
import { getFlowers, Flower } from 'lib/api/flowers';

export default function HomePage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [categories, setCategories] = useState<FlowerCategory[]>([]);

  useEffect(() => {
    const load = async () => {
      const [fetchedFlowers, fetchedCategories] = await Promise.all([
        getFlowers(),
        getFlowerCategories(),
      ]);
      setFlowers(fetchedFlowers.slice(0, 6));
      setCategories(fetchedCategories);
    };
    load();
  }, []);

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto space-y-12">
      <section className="text-center py-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-3xl shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-pink-800 mb-4">🌸 Ласкаво просимо до Flower Store</h1>
        <p className="text-lg text-gray-700 mb-6">Найкращі квіти для найкращих моментів вашого життя</p>
        <Link href="/shop">
          <button className="bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 transition text-lg font-semibold">
            Перейти до магазину
          </button>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🌼 Популярні квіти</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {
            flowers.map((flower) => (
              <div key={ flower.id } className="bg-white rounded-2xl shadow-md overflow-hidden">
                <IKImage
                  urlEndpoint={ `${config.env.imagekit.urlEndpoint}/flowers` }
                  path={ flower.image as string }
                  alt={ flower.name }
                  width={ 500 }
                  height={ 500 }
                  className="w-full h-76 object-cover"
                />
                <div className="p-4 space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">{ flower.name }</h3>
                  <p className="text-sm text-gray-600">{ flower.description?.slice(0, 60) }...</p>
                  <div className="text-pink-600 font-bold mt-2">{ flower.price } грн</div>
                </div>
              </div>
            ))
          }
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🌷 Наявні категорії</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {
            categories.map((category) => (
              <p key={ category.id } className="bg-white px-5 py-2 rounded shadow text-m font-medium text-pink-700">
                { category.name }
              </p>
            ))
          }
        </div>
      </section>
    </main>
  );
}
