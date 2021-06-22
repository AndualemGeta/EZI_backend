import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from 'src/app/componenet/home/home.routing';
import { HomeComponent } from 'src/app/componenet/home/home.component';
import { AppCommonModule } from 'src/app//app.common.module';
import { Material2Module } from "src/app/material2.module";
import { HeadingComponent } from 'src/app/componenet/heading/heading.component';
import {FooterComponent} from "src/app/componenet/footer/footer.component";
import { AboutComponent } from 'src/app/componenet/about/about.component';
import { InformationComponent } from "src/app/componenet/information/information.component";
import { TravelInformationComponent } from 'src/app/componenet/TravelInformation/travel-information.component';
import { PaymentOptionComponent } from 'src/app/componenet/paymentOption/payment-option.component';
import { ContactComponent } from 'src/app/componenet/contact/contact.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {HowItWorkModule} from "src/app/componenet/how-it-work/how-it-work.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    AppCommonModule,
    Material2Module,
    FlexLayoutModule,
    HowItWorkModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [HomeComponent,HeadingComponent,AboutComponent,InformationComponent,TravelInformationComponent,PaymentOptionComponent,ContactComponent,FooterComponent]
})
export class HomeModule { }