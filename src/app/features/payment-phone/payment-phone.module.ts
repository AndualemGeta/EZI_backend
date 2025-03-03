import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentPhoneComponent } from 'src/app/features/payment-phone/payment-phone.component';
import { PaymentPhoneRoutingModule } from 'src/app/features/payment-phone/payment-phone.routing';
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
    PaymentPhoneRoutingModule,
    AppCommonModule,
    Material2Module,
    FlexLayoutModule,
    HeaderModule,
    FormsModule, ReactiveFormsModule, Ng2TelInputModule
  ],
  declarations: [PaymentPhoneComponent],
  exports: [PaymentPhoneComponent],
})
export class PaymentPhoneModule {}
