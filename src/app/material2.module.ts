import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCheckboxModule, MatCardModule, MatDividerModule, MatIconModule,
    MatSidenavModule, MatToolbarModule, MatListModule, MatTooltipModule, MatTabsModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,  MatChipsModule
} from '@angular/material';
       import {MatDatepickerModule} from '@angular/material/datepicker';
       import {MatSelectModule} from '@angular/material/select';
@NgModule({

  imports: [MatButtonModule, MatCheckboxModule, MatCardModule, MatDividerModule, MatIconModule, 
            MatSidenavModule, MatToolbarModule, MatListModule, MatTooltipModule, MatTabsModule,
            MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule,MatDatepickerModule, MatChipsModule],
  exports: [MatButtonModule, MatCheckboxModule, MatCardModule, MatDividerModule, MatIconModule, 
            MatSidenavModule, MatToolbarModule, MatListModule, MatTooltipModule, MatTabsModule,
            MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule,MatDatepickerModule,MatSelectModule, MatChipsModule]
})
export class Material2Module { }
