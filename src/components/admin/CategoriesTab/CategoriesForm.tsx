import { useState } from 'react';
import { Category } from './CategoriesTab.types';

type Props = {
  category: Category | null;
  onCancel: () => void;
  onSave: (category: Omit<Category, 'id'> & { id?: string }) => void;
};

export default function CategoryForm({ category, onCancel, onSave }: Props) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: category?.id, name, description });
  };

  return (
    <form
      onSubmit={ handleSubmit }
      className="mb-6 p-4 bg-white rounded shadow max-w-md mx-auto space-y-4"
    >
      <h3 className="text-lg font-semibold">{ category ? 'Редагувати категорію' : 'Додати категорію' }</h3>

      <label className="block">
        <span className="text-sm text-gray-700">Назва</span>
        <input
          type="text"
          value={ name }
          onChange={ (e) => setName(e.target.value) }
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Опис</span>
        <textarea
          value={ description }
          onChange={ (e) => setDescription(e.target.value) }
          className="w-full p-2 border rounded"
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
