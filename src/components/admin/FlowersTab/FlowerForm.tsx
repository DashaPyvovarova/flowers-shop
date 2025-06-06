import { useState } from 'react';
import { FlowerCategory } from 'lib/api/flowerCategories';
import { Flower } from 'lib/api/flowers';

type FlowerFormProps = {
  flower: Flower | null;
  categories: FlowerCategory[];
  onCancel: () => void;
  onSave: (flower: Omit<Flower, 'id'> & { id?: string }) => void;
};

export default function FlowerForm({ flower, categories, onCancel, onSave }: FlowerFormProps) {
  const [name, setName] = useState(flower?.name || '');
  const [price, setPrice] = useState(flower?.price || '');
  const [stock, setStock] = useState(flower?.stock || 0);
  const [description, setDescription] = useState(flower?.description || '');
  const [image, setImage] = useState(flower?.image || '');
  const [categoryId, setCategoryId] = useState(flower?.categoryId || '');

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: flower?.id,
      name,
      price,
      stock,
      description,
      image,
      categoryId,
    });
  }

  return (
    <form
      onSubmit={ submitHandler }
      className="mb-6 p-4 bg-white rounded shadow max-w-md mx-auto space-y-4"
    >
      <h3 className="text-lg font-semibold">{ flower ? 'Редагувати квітку' : 'Додати квітку' }</h3>

      <div>
        <label className="block mb-1 font-medium">Назва</label>
        <input
          type="text"
          value={ name }
          onChange={ (e) => setName(e.target.value) }
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Ціна</label>
        <input
          type="number"
          value={ price }
          onChange={ (e) => setPrice(e.target.value) }
          className="w-full p-2 border rounded"
          min={ 0 }
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">В наявності (шт)</label>
        <input
          type="number"
          value={ stock }
          onChange={ (e) => setStock(Number(e.target.value)) }
          className="w-full p-2 border rounded"
          min={ 0 }
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Опис</label>
        <textarea
          value={ description }
          onChange={ (e) => setDescription(e.target.value) }
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Зображення (URL)</label>
        <input
          type="text"
          value={ image }
          onChange={ (e) => setImage(e.target.value) }
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Категорія</label>
        <select
          value={ categoryId }
          onChange={ (e) => setCategoryId(e.target.value) }
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Оберіть категорію</option>
          {
            categories.map((cat) => (
              <option key={ cat.id } value={ cat.id }>{ cat.name }</option>
            ))
          }
        </select>
      </div>

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
