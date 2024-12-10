import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../core/interfaces/User';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  public user$ = this.user$$.asObservable();
  user: User | undefined;

  subscription: Subscription;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    //get subscription from Observable and set user
    this.subscription = this.user$.subscribe((user) => {
      this.user = user;
    });
  }

  get isLogged(): boolean {
    return !!this.user;
  }

  getUser() {
    return this.user;
  }

  loginUser(email: string, password: string) {
    return this.http
      .post<User>(`/api/user/login`, {
        email,
        password,
      })
      .pipe(
        tap({
          next: (user) => {
            this.user$$.next(user);
            this.toastrService.success(
              `Welcome ${user.email}!`,
              'Log in Successful'
            );
          },
          error: (errorResponse) => {
            this.toastrService.error(errorResponse.error, 'Log in error');
          },
        })
      );
  }

  registerUser(
    email: string,
    phonenumber: number,
    password: string,
    rePass: string
  ) {
    return this.http
      .post<User>(`/api/user/register`, {
        email,
        phonenumber,
        password,
        rePass,
      })
      .pipe(
        tap({
          next: (user) => {
            this.user$$.next(user);
            this.toastrService.success(
              `Welcome ${user.email}!`,
              'Register successful'
            );
          },
          error: (errorResponse) => {
            this.toastrService.error(errorResponse.error, 'Register error');
          },
        })
      );
  }

  getProfile() {
    return this.http.get<User>('/api/user/profile').pipe(
      tap((user) => {
        this.user$$.next(user);
      })
    );
  }
  logOutUser() {
    return this.http.post<User>(`/api/user/logout`, {}).pipe(
      tap({
        next: () => {
          this.user$$.next(undefined);
          this.toastrService.success(`Log out successful!`);
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Log out error');
        },
      })
    );
  }

  editProfile(user: User, creator: User) {
    return this.http
      .post<User>(`/api/user/editProfile`, { user, creator })
      .pipe(
        tap({
          next: (user) => {
            this.user$$.next(user);
            this.toastrService.success('Edit profile Successful');
          },
          error: (errorResponse) => {
            this.toastrService.error(errorResponse.error, 'Edit profile error');
          },
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
