import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationResultComponent } from 'src/app/features/reservation-result/reservation-result.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationResultRoutingModule {}
