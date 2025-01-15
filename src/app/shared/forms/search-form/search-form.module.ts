import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchFormComponent } from "src/app/shared/forms/search-form/search-form.component";
import { AppCommonModule } from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@NgModule({
  declarations: [SearchFormComponent],
  exports: [SearchFormComponent],
  imports: [CommonModule, AppCommonModule,Material2Module],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchFormModule {}