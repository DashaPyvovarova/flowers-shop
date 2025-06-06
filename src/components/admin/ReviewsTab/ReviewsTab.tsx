'use client';

import { useEffect, useState } from 'react';
import ReviewForm from './ReviewsForm';
import { Flower, getFlowers } from 'lib/api/flowers';
import {
  Review,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from 'lib/api/reviews';
import { User, getUsers } from 'lib/api/users';

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    getReviews().then(setReviews);
    getUsers().then(setUsers);
    getFlowers().then(setFlowers);
  }, []);

  const handleSave = async (
    review: Omit<Review, 'id' | 'date'> & { id?: string },
  ) => {
    if (review.id) {
      const updated = await updateReview(review.id, review);
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const created = await createReview(review);
      setReviews((prev) => [created, ...prev]);
    }

    setEditingReview(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Відгуки</h2>
        <button
          onClick={
            () => {
              setIsAdding(true);
              setEditingReview(null);
            }
          }
          className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
        >
          Додати відгук
        </button>
      </div>

      {
        (isAdding || editingReview) && (
          <ReviewForm
            review={ editingReview }
            users={ users }
            flowers={ flowers }
            flowerId={ editingReview?.flowerId || (flowers[0]?.id ?? '') }
            onCancel={
              () => {
                setEditingReview(null);
                setIsAdding(false);
              }
            }
            onSave={ handleSave }
          />
        )
      }

      <ul className="space-y-3">
        {
          reviews.map((review) => {
            const user = users.find((u) => u.id === review.userId);
            return (
              <li
                key={ review.id }
                className="p-4 bg-white rounded shadow flex justify-between items-start"
              >
                <div>
                  <p className="text-sm text-gray-600">Оцінка: { review.rating } / 5</p>
                  <p className="mt-1">{ review.comment }</p>
                  <p className="text-xs text-gray-400 mt-2">
                  Користувач: { user?.login || user?.email || 'Невідомий' }
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={ () => setEditingReview(review) }
                  >
                  Редагувати
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={ () => handleDelete(review.id) }
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
