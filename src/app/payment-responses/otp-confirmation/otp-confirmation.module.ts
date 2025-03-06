import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpConfirmationComponent } from 'src/app/payment-responses/otp-confirmation/otp-confirmation.component';
import { OtpConfirmationRoutingModule } from 'src/app/payment-responses/otp-confirmation/otp-confirmation.routing';
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
    OtpConfirmationRoutingModule,
    AppCommonModule,
    Material2Module,
    FlexLayoutModule,
    HeaderModule,
    FormsModule, ReactiveFormsModule, Ng2TelInputModule
  ],
  declarations: [OtpConfirmationComponent],
  exports: [OtpConfirmationComponent],
})

export class OtpConfirmationModule {}
