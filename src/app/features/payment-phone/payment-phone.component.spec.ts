import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPhoneComponent } from './payment-phone.component';

describe('PaymentPhoneComponent', () => {
  let component: PaymentPhoneComponent;
  let fixture: ComponentFixture<PaymentPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
