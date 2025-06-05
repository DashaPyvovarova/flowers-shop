'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { successToast, warningToast } from 'basics/utils/toast';
import { getUserById, updateUser, User } from 'lib/api/users';

export type UpdateUserDTO = {
  login?: string;
  email?: string;
  password?: string;
};

export default function ProfileForm() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id as string;
  const [form, setForm] = useState<UpdateUserDTO>({});
  const [initialUser, setInitialUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUserId) return;
    getUserById(currentUserId)
      .then(setInitialUser)
      .finally(() => setLoading(false));
  }, [currentUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const updated = await updateUser(currentUserId, form);
      successToast('Профіль оновлено');
      setInitialUser(updated);
    } catch {
      warningToast('Помилка при оновленні профілю');
    }
  };

  if (loading) return <div className="text-center text-gray-500">Завантаження профілю...</div>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl border w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Профіль</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Логін</span>
          <input
            name="login"
            defaultValue={ initialUser?.login }
            onChange={ handleChange }
            className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            name="email"
            defaultValue={ initialUser?.email }
            onChange={ handleChange }
            className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Новий пароль</span>
          <input
            name="password"
            type="password"
            onChange={ handleChange }
            className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <button
          onClick={ handleSubmit }
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Зберегти
        </button>
      </div>
    </div>
  );
}
