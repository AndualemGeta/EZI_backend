import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripListRoutingModule } from 'src/app/features/trip-list/trip-list.routing';
import { TripListComponent } from 'src/app/features/trip-list/trip-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import {HeaderModule} from"src/app/shared/pages/header/header.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSliderModule} from '@angular/material/slider';
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    TripListRoutingModule,
    FlexLayoutModule,
    AppCommonModule,
    Material2Module,
    FormsModule, ReactiveFormsModule,
    MatGridListModule,
    MatStepperModule,
    MatSliderModule
  ],
  declarations: [TripListComponent ]
})
export class TripListModule { }