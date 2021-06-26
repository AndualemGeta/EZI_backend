import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveTripComponent } from './reserve-trip.component';

describe('SearchRouteComponent', () => {
  let component: ReserveTripComponent;
  let fixture: ComponentFixture<ReserveTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
