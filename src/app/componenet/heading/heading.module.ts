import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeadingComponent } from "src/app/componenet/heading/heading.component";
import { AppCommonModule } from "src/app/app.common.module";
import { Material2Module } from "src/app/material2.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
@NgModule({
  // declarations: [HeadingComponent],
  // exports: [HeadingComponent],
  imports: [CommonModule, AppCommonModule,Material2Module,FormsModule, ReactiveFormsModule],
})
export class HeadingModule {}