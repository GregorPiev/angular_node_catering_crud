import { Food } from "./Food";

export class CartItem{
  quantity: number = 1;
  price: number = this.food.price;
  constructor(public food: Food) {}
}
