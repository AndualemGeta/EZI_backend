import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationResultComponent } from './reservation-result.component';

describe('ReservationResultComponent', () => {
  let component: ReservationResultComponent;
  let fixture: ComponentFixture<ReservationResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
