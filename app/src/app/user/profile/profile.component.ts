import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfume } from 'src/app/core/interfaces/Perfume';
import { User } from 'src/app/core/interfaces/User';
import { ApiService } from 'src/app/core/services/api-service.service';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  appEmailDomains = ['bg', 'com'];

  isLoading: boolean = true;
  isEmpty: boolean = false;
  perfumesList: Perfume[] = [];
  creator: User | undefined;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUser();

    if (this.creator) {      
      this.apiService.getPerfumesByCreator(this.creator).subscribe({
        next: (p) => {
          this.perfumesList = p;
          if (this.perfumesList.length <= 0) {
            this.isEmpty = true;
          }
          this.isLoading = false;
        },
        error: (err: Error) => {
          this.isLoading = false;
          console.error(`Error occured: ${err.message}`);
        },
      });
    }
  }

  fetchUser() {
    this.creator = this.userService.getUser();
  }

  editProfile(form: NgForm) {
    if (form.invalid) return;

    if (form.value && this.creator) {
      
      this.userService.editProfile(form.value, this.creator).subscribe(() => {
        this.userService.logOutUser().subscribe();
        this.router.navigate(['/']);
      });
    }
  }
}
