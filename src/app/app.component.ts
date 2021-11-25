import { ChangeDetectorRef, Component, OnDestroy, Inject } from '@angular/core';
import * as AOS from 'aos';
import { DOCUMENT } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { SE } from './componenet/directives/scroll.directive';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from './Service/SessionService';
import { Meta,Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 // title = 'ezibus';
  contactFabButton: any;
  bodyelement: any;
  sidenavelement: any;

  isActive = false;
  isActivefadeInDown = true;
  fixedTolbar = true;

	mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
 

  constructor(@Inject(DOCUMENT) private document: Document,private meta: Meta, private title: Title,private sessionService: SessionService ,private translate: TranslateService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)',);
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    translate.setDefaultLang("en");
    var language = this.sessionService.getItem("local-language");
    if (language != null && language.length > 0) {
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use(language);
    } else {
      this.sessionService.setItem("local-language", "en");
    }

    this.meta.addTags([
      {name: 'description', content: 'Online Bus ticket '},
      {name: 'author', content: 'Ezi bus'},
      {name: 'keywords', content: 'bus ethiopia,bus ticket Ethiopia,online bus ticket,bus ticket,ethioian bus,bus'}
    ]);
    this.setTitle('EZIBUS');

  }
  public setTitle( PageTitle: string) {
    this.title.setTitle(PageTitle);
    }


  ngOnInit(){
    AOS.init();
    }
  public detectScroll(event: SE) {
    
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
  



}