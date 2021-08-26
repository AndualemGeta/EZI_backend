import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeatListComponent } from 'src/app/features/seat-list/seat-list.component';

const routes: Routes = [
  {
    path: '',
    component: SeatListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeatListRoutingModule {}
