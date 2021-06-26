import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsRoutingModule } from 'src/app/information/terms/terms.routing';
import { TermsComponent } from 'src/app/information/terms/terms.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import {HeaderModule} from"src/app/shared/pages/header/header.module";
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    TermsRoutingModule,
    FlexLayoutModule,
    AppCommonModule,
    Material2Module
  ],
  declarations: [TermsComponent ]
})
export class TermsModule { }