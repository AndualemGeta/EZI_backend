
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, Inject, OnInit, HostListener } from '@angular/core';
import { SE } from 'src/app/componenet/directives/scroll.directive';
import { ContactDialogComponent } from  'src/app/componenet/contact-dialog/contact-dialog.component';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import * as AOS from 'aos';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {

  cities: any[];
  Trip: any;
accounts:any[];

  contactFabButton: any;
  bodyelement: any;
  sidenavelement: any;
 
  isActive = false;
  isActivefadeInDown = true;
  fixedTolbar = true;

	mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(@Inject(DOCUMENT)  document: Document,private eziService: EziBusService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  }
  ngOnInit(){
    AOS.init();
    this.getAllBankAccounts();
    this.getAllLocations();  
  }


    getAllLocations() {
      this.eziService.getAllLocations().then((value) => {
  
        this.cities = value;
      });
    }
  
    getAllBankAccounts() {
      this.eziService.getOperatorAccounts().then((response) => {
    
        this.accounts = response;
      });
    }


  public detectScroll(event: any) {

    if (event.header) {
      this.isActive = false;
      this.isActivefadeInDown = true;
      this.fixedTolbar = true;
    }
    
    if (event.bottom) {
      this.isActive = true;
      this.isActivefadeInDown  = false;
      this.fixedTolbar = false;
    }
    
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


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
scroll(id:any) {
    document.getElementById(id)?.scrollIntoView();
}

}