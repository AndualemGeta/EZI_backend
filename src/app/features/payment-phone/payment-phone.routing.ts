import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentPhoneComponent } from 'src/app/features/payment-phone/payment-phone.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentPhoneComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentPhoneRoutingModule {}
