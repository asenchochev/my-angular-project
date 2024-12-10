import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfume } from 'src/app/core/interfaces/Perfume';
import { User } from 'src/app/core/interfaces/User';
import { ApiService } from 'src/app/core/services/api-service.service';
import { CartService } from 'src/app/core/services/cart.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-curr-perfume',
  templateUrl: './curr-perfume.component.html',
  styleUrls: ['./curr-perfume.component.css'],
})
export class CurrPerfumeComponent implements OnInit {
  perfume: Perfume | undefined;
  user: User | undefined;

  isLoading: boolean = true;
  isCreator: boolean = false;
  isAuth: boolean = false;
  canAddToCart = true;
  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchUser();
    this.fetchPerfume();
  }
  fetchPerfume(): void {
    const id = this.activatedRoute.snapshot.params['perfumeId'];
    this.apiService.getPerfume(id).subscribe((perfume: Perfume) => {
      this.perfume = perfume;
      this.isLoading = false;
      
      if (this.perfume.owner == this.user?._id) {
        this.isCreator = true;
      }

      if (this.user) {
        this.isAuth = true;
      } else {
        this.isAuth = false;
        this.canAddToCart = false;
      }

      if (this.isCreator) this.canAddToCart = false;

      
    });
  }

  fetchUser() {
    this.user = this.userService.getUser();
  }

  deletePerfume() {
    const id = this.activatedRoute.snapshot.params['perfumeId'];
    if (id) {
      this.apiService.deletePerfume(id).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: () => {
          this.router.navigate(['/home']);
        },
      });
    }
  }

  addToCart() {
    if (this.perfume) {
      this.cartService.addToCart(this.perfume);
      this.router.navigate(['/cart']);
    }
  }

}
