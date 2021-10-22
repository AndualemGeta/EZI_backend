import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintTicketComponent } from 'src/app/features/print-ticket/print-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: PrintTicketComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintTicketRoutingModule {}
