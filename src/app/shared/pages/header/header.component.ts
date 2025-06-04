import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, Inject, OnInit, HostListener } from '@angular/core';
import { SE } from 'src/app/componenet/directives/scroll.directive';
import { ContactDialogComponent } from  'src/app/componenet/contact-dialog/contact-dialog.component';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import * as AOS from 'aos';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { Location } from '@angular/common'
import {Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/Service/SessionService';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  locale: string;
  contactFabButton: any;
  bodyelement: any;
  sidenavelement: any;
   isActive = false;
  isActivefadeInDown = true;
  fixedTolbar = true;
  mobileQuery: MediaQueryList;
 private _mobileQueryListener: () => void;
 constructor(@Inject(DOCUMENT)  document: Document,private sessionService: SessionService,private eziService: EziBusService,private router: Router,
  changeDetectorRef: ChangeDetectorRef,public translate: TranslateService,
   media: MediaMatcher, 
   public dialog: MatDialog,
   private routeStateService: RouteStateService,
   private location:Location) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
    
  }
  ngOnInit(){
    AOS.init();
    this.locale = this.sessionService.getItem("local-language");
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '250px'
    });
  }

  setToggleOn(){
    this.bodyelement = document.getElementById('nglpage');
    this.bodyelement.classList.add("scrollOff");
    this.contactFabButton = document.getElementById('contact-fab-button');
    this.contactFabButton.style.display = "none";
    }

  setToggleOff(){
    this.bodyelement = document.getElementById('nglpage');
    this.bodyelement.classList.remove("scrollOff");
    this.contactFabButton = document.getElementById('contact-fab-button');
    this.contactFabButton.removeAttribute("style");
  }
 
scroll(id:any) {
    document.getElementById(id)?.scrollIntoView();
}
gotoHome(){
    this.routeStateService.add(
    "user-list",
    "/",
     {},
    false
  );
}

ChangeLanguage(lang) {
  this.locale = lang;
  if (
    this.locale == undefined ||
    this.locale == null ||
    this.locale.length == 0
  ) {
    this.locale = "en";
  }
  this.translate.use(this.locale);
  this.sessionService.setItem("local-language", this.locale);
}
}