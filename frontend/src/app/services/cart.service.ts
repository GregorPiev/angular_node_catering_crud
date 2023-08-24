import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart:Cart = this.getCartFromLocaleStorage();
  private cartSubject:BehaviorSubject<Cart> = new  BehaviorSubject(this.cart)

  constructor() { }

  addToCart(food: Food):void{
    let cartItem = this.cart.items.find((item) => item.food.id === food.id);

    if(cartItem){
      return;
    }else{
      this.cart.items.push(new CartItem(food));
      this.setCartToLocalStorage();
    }
  }

  removeFromCart(food: Food):void{
    this.cart.items = this.cart.items.filter(item => item.food.id !== food.id);
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number): void{
    let cartItem = this.cart.items.find(item => item.food.id === foodId);

    if(!cartItem)
    return;

    cartItem.quantity = quantity;
    cartItem.price = quantity*cartItem.food.price;
    this.setCartToLocalStorage();
  }

  clearCart(): void{
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable():Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart{
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void{
    this.cart.totalPrice = this.cart.items.reduce((prevSum, currItem)=>prevSum + currItem.price, 0);
    this.cart.totalCount = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart',cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocaleStorage(): Cart{
    const cartJson = localStorage.getItem('Cart');
    return cartJson?JSON.parse(cartJson) : new Cart();

  }
}
