import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmPaymentComponent } from 'src/app/payment-responses/confirm-payment/confirm-payment.component';

const routes: Routes = [
  {
    path: '',
    component: ConfirmPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmPaymentRoutingModule {}
