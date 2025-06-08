'use client';

import { hash } from 'bcryptjs';
import { useEffect, useState } from 'react';
import UserForm from './UsersForm';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
} from 'lib/api/users';

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleSave = async (user: Omit<User, 'id'> & { id?: string }) => {
    let hashedPassword = user.password;
    if (user.password) {
      hashedPassword = await hash(user.password, 10);
    }

    if (user.id) {
      const updated = await updateUser(user.id, user);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } else {
      const created = await createUser({ ...user, password: hashedPassword });
      setUsers((prev) => [created, ...prev]);
    }
    setEditingUser(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Користувачі</h2>
        <button
          onClick={
            () => {
              setIsAdding(true);
              setEditingUser(null);
            }
          }
          className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
        >
          Додати користувача
        </button>
      </div>

      {
        (isAdding || editingUser) && (
          <UserForm
            user={ editingUser }
            onCancel={
              () => {
                setEditingUser(null);
                setIsAdding(false);
              }
            }
            onSave={ handleSave }
          />
        )
      }

      <ul className="space-y-3">
        {
          users.map((user) => (
            <li
              key={ user.id }
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{ user.login }</p>
                <p className="text-sm text-gray-500">
                  { user.email } | Роль: { user.role }
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={ () => setEditingUser(user) }
                >
                Редагувати
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={ () => handleDelete(user.id) }
                >
                Видалити
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    </section>
  );
}
