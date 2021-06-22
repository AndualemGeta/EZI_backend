import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqRoutingModule } from 'src/app/information/faq/faq.routing';
import { FaqComponent } from 'src/app/information/faq/faq.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import {HeaderModule} from"src/app/shared/pages/header/header.module";
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    FaqRoutingModule,
    FlexLayoutModule,
    AppCommonModule,
    Material2Module
  ],
  declarations: [FaqComponent ]
})
export class FaqModule { }