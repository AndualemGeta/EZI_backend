import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripListRoutingModule } from 'src/app/features/trip-list/trip-list.routing';
import { TripListComponent } from 'src/app/features/trip-list/trip-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import {HeaderModule} from"src/app/shared/pages/header/header.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
<<<<<<< HEAD
import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSliderModule} from '@angular/material/slider';
=======
>>>>>>> d2797e1bdc9d06e4ce19f7e901a5905a713729ab
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    TripListRoutingModule,
    FlexLayoutModule,
    AppCommonModule,
    Material2Module,
<<<<<<< HEAD
    FormsModule, ReactiveFormsModule,
    MatGridListModule,
    MatStepperModule,
    MatSliderModule
=======
    FormsModule, ReactiveFormsModule
>>>>>>> d2797e1bdc9d06e4ce19f7e901a5905a713729ab
  ],
  declarations: [TripListComponent ]
})
export class TripListModule { }