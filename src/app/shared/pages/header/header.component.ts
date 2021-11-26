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
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {



  contactFabButton: any;
  bodyelement: any;
  sidenavelement: any;
   isActive = false;
  isActivefadeInDown = true;
  fixedTolbar = true;
  mobileQuery: MediaQueryList;
 private _mobileQueryListener: () => void;
 constructor(@Inject(DOCUMENT)  document: Document,private eziService: EziBusService,private router: Router,
  changeDetectorRef: ChangeDetectorRef,
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
  this.router.navigate(["book-bus-tickets-in-ethiopia"]);
  //this.location.back();
}
}