import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  appEmailDomains = ['bg', 'com'];

  constructor(private userService: UserService, private router: Router) {}

  login(form: NgForm) {
    if (form.invalid) return;

    const { email, password } = form.value;

    this.userService.loginUser(email, password).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
