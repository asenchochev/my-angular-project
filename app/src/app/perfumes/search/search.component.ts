import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Perfume } from 'src/app/core/interfaces/Perfume';
import { ApiService } from 'src/app/core/services/api-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  perfumesList: Perfume[] = [];
  brand: string = '';
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  search(form: NgForm) {
    this.isLoading = true
    if (form.invalid) return;

    this.brand = form.value.brand;

    this.apiService.search(this.brand).subscribe({
      next: (perfumes) => {
        this.perfumesList = perfumes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
