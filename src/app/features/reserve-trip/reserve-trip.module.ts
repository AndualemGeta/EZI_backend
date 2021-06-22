import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReserveTripComponent } from 'src/app/features/reserve-trip/reserve-trip.component';
import { ReserveTripRoutingModule } from 'src/app/features/reserve-trip/reserve-trip.routing';
import { HttpClient } from '@angular/common/http';
import {HeaderModule} from"src/app/shared/pages/header/header.module";
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    ReserveTripRoutingModule,
    AppCommonModule,
    Material2Module,
    FlexLayoutModule,
    HeaderModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [ReserveTripComponent],
  
})
export class ReserveTripdModule {}
