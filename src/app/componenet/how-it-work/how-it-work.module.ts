import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowItWorkComponent } from 'src/app/componenet/how-it-work/how-it-work.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppCommonModule} from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    AppCommonModule,
    Material2Module
  ],
  exports: [HowItWorkComponent],
  declarations: [HowItWorkComponent ]
})
export class HowItWorkModule { }