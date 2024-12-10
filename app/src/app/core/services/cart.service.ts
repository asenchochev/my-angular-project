import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../interfaces/Cart';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Perfume } from '../interfaces/Perfume';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  addToCart(perfume: Perfume): void {
    let cartItem = this.cart.items.find((item) => {
      return item.perfume._id === perfume?._id;
    });

    if (cartItem) {
      cartItem.quantity++;
      if (perfume) {
        this.changeQuantity(perfume._id, cartItem.quantity);
      }
    } else {
      if (perfume) {
        this.cart.items.push({
          perfume,
          quantity: 1,
          price: perfume.price,
        });
      }
    }
    this.setCartToLocalStorage();
  }

  changeQuantity(perfumeId: string, quantity: number) {
    let cartItem = this.cart.items.find((item) => {
      return item.perfume._id == perfumeId;
    });
    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.perfume.price;
    this.setCartToLocalStorage();
  }
  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('Cart');
    if (cartJson) {
      return JSON.parse(cartJson);
    } else {
      return {
        items: [],
        totalPrice: 0,
      };
    }
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items.reduce(
      (accumulator, currentItem) => accumulator + currentItem.price,
      0
    );
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  clearCart() {
    this.cart = {
      items: [],
      totalPrice: 0,
    };
    this.setCartToLocalStorage();
  }

  removeFromCart(perfumeId: string): void {
    this.cart.items = this.cart.items.filter(
      (item) => item.perfume._id != perfumeId
    );
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }
}
