import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatListComponent } from 'src/app/features/seat-list/seat-list.component';
import { SeatListRoutingModule } from 'src/app/features/seat-list/seat-list.routing';
import { HttpClient } from '@angular/common/http';
import {HeaderModule} from"src/app/shared/pages/header/header.module";
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    SeatListRoutingModule,
    AppCommonModule,
    Material2Module,
    FlexLayoutModule,
    HeaderModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [SeatListComponent],
  exports: [SeatListComponent],
})
export class SeatListModule {}
