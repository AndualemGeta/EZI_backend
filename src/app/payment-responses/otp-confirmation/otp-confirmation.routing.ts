import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtpConfirmationComponent } from 'src/app/payment-responses/otp-confirmation/otp-confirmation.component';
const routes: Routes = [
  {
    path: '',
    component: OtpConfirmationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpConfirmationRoutingModule {}
