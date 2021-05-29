import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatCardModule, MatDividerModule, MatIconModule, 
	     MatSidenavModule, MatToolbarModule, MatListModule, MatTooltipModule, MatTabsModule, MatTableModule, 
	     MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
       import {MatDatepickerModule} from '@angular/material/datepicker';
       import {MatSelectModule} from '@angular/material/select';
@NgModule({

  imports: [MatButtonModule, MatCheckboxModule, MatCardModule, MatDividerModule, MatIconModule, 
            MatSidenavModule, MatToolbarModule, MatListModule, MatTooltipModule, MatTabsModule, 
            MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule,MatDatepickerModule],
  exports: [MatButtonModule, MatCheckboxModule, MatCardModule, MatDividerModule, MatIconModule, 
            MatSidenavModule, MatToolbarModule, MatListModule, MatTooltipModule, MatTabsModule, 
            MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule,MatDatepickerModule,MatSelectModule]
})
export class Material2Module { }
