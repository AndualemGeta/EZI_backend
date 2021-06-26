import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DirectivesModule } from 'src/app/componenet/directives/directives.module';
<<<<<<< HEAD
import {MatSliderModule} from '@angular/material/slider';
@NgModule({
    imports: [
        CommonModule,FlexLayoutModule,FormsModule,ReactiveFormsModule,DirectivesModule,MatSliderModule
=======

@NgModule({
    imports: [
        CommonModule,FlexLayoutModule,FormsModule,ReactiveFormsModule,DirectivesModule
>>>>>>> d2797e1bdc9d06e4ce19f7e901a5905a713729ab
    ],
    exports: [],
    declarations: []
})
export class AppCommonModule {

}