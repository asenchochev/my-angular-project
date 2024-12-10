import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Perfume } from '../interfaces/Perfume';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/User';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getPerfumes() {
    const { appUrl } = environment;
    return this.http.get<Perfume[]>(`${appUrl}/home`);
  }

  createPerfume(
    brand: string,
    model: string,
    amount: number,
    imageUrl: string,
    price: string,
    description: string,
    owner: User
  ) {
    return this.http
      .post<Perfume>(`/api/perfumes/create`, {
        brand,
        model,
        amount,
        imageUrl,
        price,
        description,
        owner,
      })
      .pipe(
        tap({
          next: () => {
            this.toastrService.success(`Create successful!`);
          },
          error: (err) => {
            this.toastrService.error(err.error.text, `Create error!`);
          },
        })
      );
  }

  getPerfume(id: string) {
    const { appUrl } = environment;
    return this.http.get<Perfume>(`${appUrl}/${id}`);
  }

  editPerfume(id: string, newData: Perfume) {
    const { appUrl } = environment;

    return this.http
      .put<Perfume>(`${appUrl}/perfumes/${id}/edit`, newData)
      .pipe(
        tap({
          next: () => {
            this.toastrService.success(`Edit successful!`);
          },
          error: (err) => {
            this.toastrService.error(err.error.text, `Edit error!`);
          },
        })
      );
  }

  deletePerfume(id: string) {
    const { appUrl } = environment;
    return this.http.delete<Perfume>(`${appUrl}/perfumes/${id}/delete`).pipe(
      tap({
        next: () => {
          this.toastrService.success(`Delete successful!`);
        },
        error: (err) => {
          this.toastrService.error(err.error.text, `Delete error!`);
        },
      })
    );
  }

  getPerfumesByCreator(owner: User) {
    return this.http.post<Perfume[]>(`/api/user/profile`, owner);
  }

  search(brand: string) {
    const { appUrl } = environment;
    return this.http.get<Perfume[]>(`${appUrl}/search/${brand}`);
  }
}
