import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from 'src/app/componenet/landing-page/landing-page.component';
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
  exports: [LandingPageComponent],
  declarations: [LandingPageComponent ]
})

export class LandingPageModule {}