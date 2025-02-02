import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationResultComponent } from 'src/app/features/reservation-result/reservation-result.component';
import { ReservationResultRoutingModule } from 'src/app/features/reservation-result/reservation-result.routing';
import { HttpClient } from '@angular/common/http';
import {HeaderModule} from"src/app/shared/pages/header/header.module";
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
  imports: [
    CommonModule,
    ReservationResultRoutingModule,
    AppCommonModule,
    Material2Module,
    FlexLayoutModule,
    HeaderModule,
    FormsModule, ReactiveFormsModule, Ng2TelInputModule
  ],
  declarations: [ReservationResultComponent],
  exports: [ReservationResultComponent],
})
export class ReservationResultModule {}
