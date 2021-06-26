import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DirectivesModule } from 'src/app/componenet/directives/directives.module';
import {MatSliderModule} from '@angular/material/slider';
import {AppRoutingModule} from './app.routing.module';
import {Material2Module} from './material2.module';
import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
@NgModule({
    imports: [
        CommonModule,FlexLayoutModule,FormsModule,ReactiveFormsModule,DirectivesModule,MatSliderModule,
       HttpClientModule, MatIconModule,
      MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule
    ] ,
    exports: [ CommonModule,FlexLayoutModule,FormsModule,ReactiveFormsModule,DirectivesModule,MatSliderModule,
      HttpClientModule, MatIconModule,
      MatDialogModule,MatProgressSpinnerModule, MatSnackBarModule],
    declarations: []
})
export class AppCommonModule {

}
