import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessPageComponent } from 'src/app/payment-responses/success-page/success-page.component';
import { SuccessPageRoutingModule } from 'src/app/payment-responses/success-page/success-page.routing';
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
    SuccessPageRoutingModule,
    AppCommonModule,
    Material2Module,
    FlexLayoutModule,
    HeaderModule,
    FormsModule, ReactiveFormsModule, Ng2TelInputModule
  ],
  declarations: [SuccessPageComponent],
  exports: [SuccessPageComponent],
})

export class SuccessPageModule {}
