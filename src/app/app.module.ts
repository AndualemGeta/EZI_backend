import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from "src/app/app.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactDialogComponent } from 'src/app/componenet/contact-dialog/contact-dialog.component';
import { AppRoutingModule } from "src/app/app.routing.module";
import { Material2Module } from "src/app/material2.module";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { TooltipModule  } from 'ngx-bootstrap/tooltip';
import { DatePipe } from "@angular/common";
import {AppCommonModule} from './app.common.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,"./assets/i18n/");
}
@NgModule({
  declarations: [
    AppComponent,
    ContactDialogComponent

  ],
  imports: [ BrowserModule, AppCommonModule, BrowserAnimationsModule,AppRoutingModule,TooltipModule.forRoot(), 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),],
  providers: [DatePipe],
  exports: [TranslateModule],
  bootstrap: [AppComponent],
  entryComponents: [ContactDialogComponent ],

})
export class AppModule { }
