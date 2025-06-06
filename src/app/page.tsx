'use client';

import { IKImage } from 'imagekitio-next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { config } from '../config/config';
import { FlowerCategory, getFlowerCategories } from 'lib/api/flowerCategories';
import { getFlowers, Flower } from 'lib/api/flowers';
import { getReviews, Review } from 'lib/api/reviews';
import { getUsers } from 'lib/api/users';

type ReviewWithDetails = Review & {
  flowerName: string;
  userName: string;
};

export default function HomePage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [categories, setCategories] = useState<FlowerCategory[]>([]);
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);

  const [loadingFlowers, setLoadingFlowers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const loadFlowersAndCategories = async () => {
      const [fetchedFlowers, fetchedCategories] = await Promise.all([
        getFlowers(),
        getFlowerCategories(),
      ]);
      setFlowers(fetchedFlowers.slice(0, 6));
      setCategories(fetchedCategories);
      setLoadingFlowers(false);
      setLoadingCategories(false);
    };

    const loadReviews = async () => {
      const [fetchedFlowers, , fetchedReviews, users] = await Promise.all([
        getFlowers(),
        getFlowerCategories(),
        getReviews(),
        getUsers(),
      ]);

      const flowerMap = new Map(fetchedFlowers.map((f) => [f.id, f.name]));
      const userMap = new Map(users.map((u) => [u.id, u.login || u.email]));

      const reviewsWithDetails = fetchedReviews.slice(0, 5).map((r) => ({
        ...r,
        flowerName: flowerMap.get(r.flowerId) || 'Невідома квітка',
        userName: userMap.get(r.userId) || 'Анонім',
      }));

      setReviews(reviewsWithDetails);
      setLoadingReviews(false);
    };

    loadFlowersAndCategories();
    loadReviews();
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
        {
          loadingFlowers ? (
            <p className="text-center text-gray-500">Завантаження квітів...</p>
          ) : (
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
          )
        }
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🌷 Наявні категорії</h2>
        {
          loadingCategories ? (
            <p className="text-center text-gray-500">Завантаження категорій...</p>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {
                categories.map((category) => (
                  <p key={ category.id } className="bg-white px-5 py-2 rounded shadow text-m font-medium text-pink-700">
                    { category.name }
                  </p>
                ))
              }
            </div>
          )
        }
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">💬 Відгуки клієнтів</h2>
        {
          loadingReviews ? (
            <p className="text-center text-gray-500">Завантаження відгуків...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {
                reviews.map((review) => (
                  <div key={ review.id } className="bg-white p-5 rounded-2xl shadow-md border">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{ review.userName }</span>
                      <span className="text-yellow-500 font-bold">
                        { '★'.repeat(review.rating) }
                        { '☆'.repeat(5 - review.rating) }
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                  Квітка: <span className="font-medium text-gray-800">{ review.flowerName }</span>
                    </div>
                    <p className="text-gray-700 text-sm">{ review.comment }</p>
                  </div>
                ))
              }
            </div>
          )
        }
      </section>
    </main>
  );
}
