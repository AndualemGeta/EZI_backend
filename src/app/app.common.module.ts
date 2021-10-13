import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DirectivesModule } from 'src/app/componenet/directives/directives.module';
import {MatSliderModule} from '@angular/material/slider';
import {Material2Module} from './material2.module';
import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {Ng2TelInputModule} from 'ng2-tel-input';

@NgModule({
    imports: [
        CommonModule,FlexLayoutModule,FormsModule,ReactiveFormsModule,DirectivesModule,MatSliderModule,
       HttpClientModule, MatIconModule,
      MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule,Material2Module, Ng2TelInputModule
    ] ,
    exports: [CommonModule,FlexLayoutModule,FormsModule,ReactiveFormsModule,DirectivesModule,MatSliderModule,
      HttpClientModule, MatIconModule,
      MatDialogModule,MatProgressSpinnerModule, MatSnackBarModule, Ng2TelInputModule],
    declarations: []
})
export class AppCommonModule {

}
