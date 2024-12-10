import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api-service.service';
import { Perfume } from '../core/interfaces/Perfume';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  isEmpty: boolean = false;
  perfumesList: Perfume[] = [];
  constructor(
    private apiService: ApiService,
  ) {}

  private subscription: Subscription | undefined;
  ngOnInit(): void {
    this.subscription = this.apiService.getPerfumes().subscribe({
      next: (perfumes) => {
        this.perfumesList = perfumes;
        if (this.perfumesList.length > 0) {
          this.isLoading = false;
        } else {
          this.isEmpty = true;
        }
      },
      error: (err) => {
        this.isEmpty = true;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
