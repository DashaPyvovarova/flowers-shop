import { Flower } from 'lib/api/flowers';

type FlowerCardProps = {
  flower: Flower;
  onAdd: (flower: Flower) => void;
};

export default function FlowerCard({ flower, onAdd }: FlowerCardProps) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer flex flex-col">
      <img src={ flower.image as string } alt={ flower.name } className="w-full h-48 object-cover rounded" />
      <h3 className="mt-2 text-lg font-semibold">{ flower.name }</h3>
      <p className="text-gray-600 flex-grow">{ flower.description }</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="font-bold text-green-700">{ flower.price } ₴</span>
        <button
          onClick={ () => onAdd(flower) }
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Додати
        </button>
      </div>
    </div>
  );
}
