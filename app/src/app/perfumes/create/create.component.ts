import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/User';
import { ApiService } from 'src/app/core/services/api-service.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  user: User | undefined;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private userService: UserService
  ) {}

  create(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.user = this.userService.getUser();

    const { brand, model, amount, imageUrl, price, description } = form.value;
    if (this.user) {
      this.apiService
        .createPerfume(
          brand,
          model,
          amount,
          imageUrl,
          price,
          description,
          this.user
        )
        .subscribe(() => {
          this.router.navigate(['/home']);
        });
    }
  }
}
