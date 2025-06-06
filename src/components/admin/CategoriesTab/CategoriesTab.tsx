'use client';

import { useEffect, useState } from 'react';
import CategoryForm from './CategoriesForm';
import { Category } from './CategoriesTab.types';
import { createFlowerCategory, deleteFlowerCategory, getFlowerCategories, updateFlowerCategory } from 'lib/api/flowerCategories';

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getFlowerCategories().then(setCategories);
  }, []);

  const handleSave = async (category: Omit<Category, 'id'> & { id?: string }) => {
    if (category.id) {
      const updated = await updateFlowerCategory(category.id, category);
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await createFlowerCategory(category);
      setCategories((prev) => [created, ...prev]);
    }
    setEditingCategory(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteFlowerCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Категорії</h2>
        <button
          onClick={
            () => {
              setIsAdding(true);
              setEditingCategory(null);
            }
          }
          className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
        >
          Додати категорію
        </button>
      </div>

      {
        (isAdding || editingCategory) && (
          <CategoryForm
            category={ editingCategory }
            onCancel={
              () => {
                setEditingCategory(null);
                setIsAdding(false);
              }
            }
            onSave={ handleSave }
          />
        )
      }

      <ul className="space-y-3">
        {
          categories.map((category) => (
            <li
              key={ category.id }
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{ category.name }</p>
                {
                  category.description && (
                    <p className="text-sm text-gray-500">{ category.description }</p>
                  )
                }
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={ () => setEditingCategory(category) }
                >
                Редагувати
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={ () => handleDelete(category.id) }
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
