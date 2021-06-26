import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from "src/app/app.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactDialogComponent } from 'src/app/componenet/contact-dialog/contact-dialog.component';
import { AppRoutingModule } from "src/app/app.routing.module";
import { Material2Module } from "src/app/material2.module";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
<<<<<<< HEAD
import {MatSliderModule} from '@angular/material/slider';
=======
>>>>>>> d2797e1bdc9d06e4ce19f7e901a5905a713729ab
@NgModule({
  declarations: [
    AppComponent,
    ContactDialogComponent 
    
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,AppRoutingModule,Material2Module,HttpClientModule
<<<<<<< HEAD
    ,FormsModule, ReactiveFormsModule,MatSliderModule  ],
=======
    ,FormsModule, ReactiveFormsModule  ],
>>>>>>> d2797e1bdc9d06e4ce19f7e901a5905a713729ab
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ ContactDialogComponent ],
  
})
export class AppModule { }
