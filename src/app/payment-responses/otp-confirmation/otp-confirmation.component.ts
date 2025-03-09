import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/Service/Payment-service';
import { RouteStateService } from 'src/app/Service/route-state.service';
@Component({
  selector: 'app-otp-confirmation',
  templateUrl: './otp-confirmation.component.html',
  styleUrls: ['./otp-confirmation.component.css']
})
export class OtpConfirmationComponent implements OnInit {
  otpForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  routeState;
  constructor(private routeStateService: RouteStateService,
    private fb: FormBuilder,
    private paymentService: PaymentService,  // Payment service to call API
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize the form with a required OTP field
    this.routeState = this.routeStateService.getCurrent()?.data;
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]] // 6-digit OTP validation
    });
  }

  get otp() {
    return this.otpForm.get('otp');
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }
    this.loading = true;
    const otp = this.otp?.value;
    const data = {
      "sessionId": this.routeState.sessionId,
      "otp": otp,
      "paymentMethod": this.routeState.paymentMethod
    };
    
    // this.routeStateService.add(
    //   "user-list",
    //   "/payment-success",
    //   {},
    //   false
    // );
    // Call the payment service to verify OTP

    this.paymentService.directPaymentVerifyOTP(data, this.routeState.paymentMethod).subscribe(
      (response) => {
        if (response.success) {
          alert("Payment Confirmed! Your seat has been reserved.");
          this.router.navigate(['/payment-success']); // Redirect to success page
          } else {
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error confirming OTP. Please try again later.';
        this.loading = false;
      }
    );
  }
}




