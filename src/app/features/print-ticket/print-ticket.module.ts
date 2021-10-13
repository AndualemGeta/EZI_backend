import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintTicketComponent } from './print-ticket.component';
import { PrintTicketRoutingModule } from './print-ticket.routing';
import { SeatListComponent } from 'src/app/features/seat-list/seat-list.component';
import { SeatListRoutingModule } from 'src/app/features/seat-list/seat-list.routing';
import { HttpClient } from '@angular/common/http';
import {HeaderModule} from"src/app/shared/pages/header/header.module";
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {Ng2TelInputModule} from 'ng2-tel-input';


@NgModule({
  declarations: [
    PrintTicketComponent
  ],

  imports: [
    CommonModule,
    PrintTicketRoutingModule
  ],
  exports : [
    PrintTicketComponent
  ]
})
export class PrintTicketModule { }
