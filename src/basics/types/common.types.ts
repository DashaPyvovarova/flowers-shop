import { Flower } from 'lib/api/flowers';

export type CartItem = {
  flower: Flower;
  quantity: number;
};
