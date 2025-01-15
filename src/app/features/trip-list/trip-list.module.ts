
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripListRoutingModule } from 'src/app/features/trip-list/trip-list.routing';
import { TripListComponent } from 'src/app/features/trip-list/trip-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import {HeaderModule} from"src/app/shared/pages/header/header.module";
import {SeatListModule} from"src/app/features/seat-list/seat-list.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {SearchFormModule} from 'src/app/shared/forms/search-form/search-form.module';
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    SearchFormModule,
    TripListRoutingModule,
    FlexLayoutModule,
    AppCommonModule,
    Material2Module,
    FormsModule, ReactiveFormsModule,
    MatGridListModule,
    MatStepperModule,
    MatSliderModule,
    MatIconModule,
    SeatListModule
  ],
  declarations: [TripListComponent ]
  
})
export class TripListModule { }
