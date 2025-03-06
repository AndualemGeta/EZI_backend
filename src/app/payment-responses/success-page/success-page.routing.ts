import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessPageComponent } from 'src/app/payment-responses/success-page/success-page.component';

const routes: Routes = [
  {
    path: '',
    component: SuccessPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessPageRoutingModule {}
