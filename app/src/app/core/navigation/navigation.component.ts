import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent{
  constructor(private userService: UserService, private router: Router, private cartService: CartService) {}

  get isLoggedIn(): boolean {
    return this.userService.isLogged
  }

  logout(): void {
    this.userService.logOutUser().subscribe({
      next: () => {
        this.cartService.clearCart()
        this.router.navigate(['/']);
      },
      error: () => {
        this.cartService.clearCart()
        this.router.navigate(['/']);
      },
    });
  }




}
