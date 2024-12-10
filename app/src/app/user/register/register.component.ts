import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  appEmailDomains = ['bg', 'com'];
  constructor(private userService: UserService, private router: Router) {}


  register(form: NgForm) {

    if(form.invalid) return;

    
    const {email,phonenumber, password, rePass} = form.value;
    
    this.userService.registerUser(email, phonenumber, password, rePass).subscribe(() => {
      this.router.navigate(["/home"])
    })
  }
}
