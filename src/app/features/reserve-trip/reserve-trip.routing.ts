import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReserveTripComponent } from 'src/app/features/reserve-trip/reserve-trip.component';

const routes: Routes = [
  {
    path: '',
    component: ReserveTripComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserveTripRoutingModule {}
