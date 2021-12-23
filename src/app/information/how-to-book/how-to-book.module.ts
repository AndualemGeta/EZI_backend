import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToBookRoutingModule } from 'src/app/information/how-to-book/how-to-book.routing';
import { HowToBookComponent } from 'src/app/information/how-to-book/how-to-book.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import {HeaderModule} from"src/app/shared/pages/header/header.module";
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    HowToBookRoutingModule,
    FlexLayoutModule,
    AppCommonModule,
    Material2Module
  ],
  declarations: [HowToBookComponent ]
})
export class HowToBookModule { }