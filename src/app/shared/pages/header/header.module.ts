import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "src/app/shared/pages/header/header.component";
import { AppCommonModule } from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [CommonModule, AppCommonModule,Material2Module],
})
export class HeaderModule {}
