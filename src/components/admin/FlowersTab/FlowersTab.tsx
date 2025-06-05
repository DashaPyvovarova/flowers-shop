import { useEffect, useState } from 'react';
import FlowerForm from './FlowerForm';
import { FlowerCategory, getFlowerCategories } from 'lib/api/flowerCategories';
import { createFlower, deleteFlower, Flower, getFlowers, updateFlower } from 'lib/api/flowers';

export default function FlowersTab() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [categories, setCategories] = useState<FlowerCategory[]>([]);
  const [editingFlower, setEditingFlower] = useState<Flower | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getFlowers().then(setFlowers);
    getFlowerCategories().then(setCategories);
  }, []);

  async function handleDelete(id: string) {
    await deleteFlower(id);
    setFlowers((f) => f.filter((flower) => flower.id !== id));
  }

  async function handleSave(flower: Omit<Flower, 'id'> & { id?: string }) {
    if (flower.id) {
      const updated = await updateFlower(flower.id, flower);
      setFlowers((f) => f.map((fl) => (fl.id === updated.id ? updated : fl)));
    } else {
      const created = await createFlower(flower);
      setFlowers((f) => [created, ...f]);
    }
    setEditingFlower(null);
    setIsAdding(false);
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Квіти</h2>
        <button
          className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
          onClick={
            () => {
              setIsAdding(true);
              setEditingFlower(null);
            }
          }
        >
          Додати квітку
        </button>
      </div>

      {
        (isAdding || editingFlower) && (
          <FlowerForm
            flower={ editingFlower }
            categories={ categories }
            onCancel={
              () => {
                setEditingFlower(null);
                setIsAdding(false);
              }
            }
            onSave={ handleSave }
          />
        )
      }

      <ul className="space-y-3">
        {
          flowers.map((flower) => (
            <li
              key={ flower.id }
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{ flower.name }</p>
                <p className="text-sm text-gray-500">
                Ціна: { flower.price } грн | В наявності: { flower.stock }
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={ () => setEditingFlower(flower) }
                >
                Редагувати
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={ () => handleDelete(flower.id) }
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
