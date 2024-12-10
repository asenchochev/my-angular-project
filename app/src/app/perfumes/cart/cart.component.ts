import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { Cart, CartItem } from 'src/app/core/interfaces/Cart';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart!: Cart;
  isEmpty: boolean = true;
  constructor(
    private cartService: CartService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  changeQuantity(cartItem: CartItem, quantityInString: string) {
    const quantity = Number(quantityInString);
    this.cartService.changeQuantity(cartItem.perfume._id, quantity);
  }

  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.perfume._id);
  }

  checkout() {
    this.toastrService.success('Payment succeded');
    this.cartService.clearCart();
    this.router.navigate(['/home']);
  }

  checkIfEmpty() {
    if (this.cart) {
      if (this.cart.items.length >= 1) {
        this.isEmpty = false;
      }
    }
  }
  ngOnInit(): void {
    this.checkIfEmpty();
  }
}
