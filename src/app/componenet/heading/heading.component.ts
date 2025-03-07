import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, Inject, OnInit, HostListener } from '@angular/core';
import { ContactDialogComponent } from  'src/app/componenet/contact-dialog/contact-dialog.component';
import { MatDialog} from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import * as AOS from 'aos';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/Service/SessionService';
@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})

export class HeadingComponent implements OnInit, OnDestroy {
  cities: any[];
  Trip: any;
  accounts:any[];
  locale: string;
  contactFabButton: any;
    bodyelement: any;
    sidenavelement: any;
    isActive = false;
    isActivefadeInDown = true;
    fixedTolbar = true;
  
    mobileQuery: MediaQueryList;
  
    private _mobileQueryListener: () => void;
    constructor(@Inject(DOCUMENT)  document: Document,private sessionService: SessionService,
    public translate: TranslateService, private eziService: EziBusService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
      
    }
    async ngOnInit(): Promise<void>{
      AOS.init();
     await this.getAllBankAccounts();
     await this.getAllLocations();  
      this.locale = this.sessionService.getItem("local-language");
    }
  
  
    async getAllLocations() {
     return this.eziService.getAllLocations().then((value) => {
        this.cities = value || []; 
      }).catch(() => {
        this.cities = []; 
      });
    }
    
    async getAllBankAccounts() {
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
    
  // scroll(id:any) {
  //     document.getElementById(id)?.scrollIntoView();
  // }
  
  scroll(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = document.querySelector('.navigation-toolbar')?.clientHeight || 0;
      const yOffset = -headerHeight; // Offset to avoid the header covering the title
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
  
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
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