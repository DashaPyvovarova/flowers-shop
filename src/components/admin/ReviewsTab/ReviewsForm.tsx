'use client';

import { useState } from 'react';
import { Flower } from 'lib/api/flowers';
import { Review } from 'lib/api/reviews';
import { User } from 'lib/api/users';

type Props = {
  review: Review | null;
  flowerId: string;
  users: User[];
  flowers: Flower[];
  onCancel: () => void;
  onSave: (review: Omit<Review, 'id' | 'date'> & { id?: string }) => void;
};

export default function ReviewForm({ review, flowerId, flowers, users, onCancel, onSave }: Props) {
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || '');
  const [userId, setUserId] = useState(review?.userId || (users[0]?.id ?? ''));
  const [selectedFlowerId, setSelectedFlowerId] = useState(review?.flowerId || flowerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: review?.id,
      flowerId: selectedFlowerId,
      rating,
      comment,
      userId,
    });
  };

  return (
    <form
      onSubmit={ handleSubmit }
      className="mb-6 p-4 bg-white rounded shadow max-w-md mx-auto space-y-4"
    >
      <h3 className="text-lg font-semibold">
        { review ? 'Редагувати відгук' : 'Додати відгук' }
      </h3>

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
        <span className="text-sm text-gray-700">Квітка</span>
        <select
          value={ selectedFlowerId }
          onChange={ (e) => setSelectedFlowerId(e.target.value) }
          className="w-full p-2 border rounded"
          required
        >
          {
            flowers.map((flower) => (
              <option key={ flower.id } value={ flower.id }>
                { flower.name || flower.id }
              </option>
            ))
          }
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Оцінка</span>
        <input
          type="number"
          value={ rating }
          onChange={ (e) => setRating(Number(e.target.value)) }
          min={ 1 }
          max={ 5 }
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Коментар</span>
        <textarea
          value={ comment }
          onChange={ (e) => setComment(e.target.value) }
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
