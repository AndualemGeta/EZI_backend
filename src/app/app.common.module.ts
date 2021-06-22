import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DirectivesModule } from 'src/app/componenet/directives/directives.module';

@NgModule({
    imports: [
        CommonModule,FlexLayoutModule,FormsModule,ReactiveFormsModule,DirectivesModule
    ],
    exports: [],
    declarations: []
})
export class AppCommonModule {

}