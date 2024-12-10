import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrPerfumeComponent } from './curr-perfume.component';

describe('CurrPerfumeComponent', () => {
  let component: CurrPerfumeComponent;
  let fixture: ComponentFixture<CurrPerfumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrPerfumeComponent]
    });
    fixture = TestBed.createComponent(CurrPerfumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
