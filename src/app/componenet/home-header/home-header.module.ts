import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from 'src/app/componenet/home-header/home-header.component';
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
  exports: [HomeHeaderComponent],
  declarations: [HomeHeaderComponent ]
})

export class HomeHeaderModule {}