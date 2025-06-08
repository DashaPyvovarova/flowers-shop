'use client';

import { useState } from 'react';
import { User } from 'lib/api/users';

type Props = {
  user: User | null;
  onCancel: () => void;
  onSave: (user: Omit<User, 'id'> & { id?: string }) => void;
};

export default function UserForm({ user, onCancel, onSave }: Props) {
  const [login, setLogin] = useState(user?.login || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<User['role']>(user?.role || 'user');
  const [password, setPassword] = useState(user?.password || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: user?.id, login, email, role, password });
  };

  return (
    <form
      onSubmit={ handleSubmit }
      className="mb-6 p-4 bg-white rounded shadow max-w-md mx-auto space-y-4"
    >
      <h3 className="text-lg font-semibold">
        { user ? 'Редагувати користувача' : 'Додати користувача' }
      </h3>

      <label className="block">
        <span className="text-sm text-gray-700">Логін</span>
        <input
          type="text"
          value={ login }
          onChange={ (e) => setLogin(e.target.value) }
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Email</span>
        <input
          type="email"
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Пароль</span>
        <input
          type="password"
          onChange={ (e) => setPassword(e.target.value) }
          className="w-full p-2 border rounded"
          required={ !user }
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Роль</span>
        <select
          value={ role }
          onChange={ (e) => setRole(e.target.value as User['role']) }
          className="w-full p-2 border rounded"
        >
          <option value="user">Користувач</option>
          <option value="admin">Адмін</option>
        </select>
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
