import { CartItem } from 'basics/types/common.types';

type CartProps = {
  items: CartItem[];
  onConfirm: () => void;
  onRemove: (flowerId: string) => void;
};

const Cart = ({ items, onConfirm, onRemove }: CartProps) => {
  const total = items.reduce((sum, item) => sum + +item.flower.price * item.quantity, 0).toFixed(2);

  return (
    <div className="p-4 rounded shadow max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Ваше замовлення</h2>
      { items.length === 0 && <p>Кошик порожній</p> }
      {
        items.map(({ flower, quantity }) => (
          <div key={ flower.id } className="flex justify-between items-center mb-2">
            <div>
              <p>{ flower.name } × { quantity }</p>
              <p className="text-sm text-gray-500">{ (+flower.price * quantity).toFixed(2) } ₴</p>
            </div>
            <button
              onClick={ () => onRemove(flower.id) }
              className="text-red-500 hover:text-red-700 font-bold"
            >
            ✕
            </button>
          </div>
        ))
      }
      {
        items.length > 0 && (
          <>
            <div className="border-t pt-2 mt-2 font-bold text-right">Всього: { total } ₴</div>
            <button
              onClick={ onConfirm }
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
            Підтвердити замовлення
            </button>
          </>
        )
      }
    </div>
  );
};

export default Cart;
