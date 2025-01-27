import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/Service/SessionService';
@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {
  locale: string;
 constructor(private sessionService: SessionService,
    public translate: TranslateService) {
      
    }
    ngOnInit(){  
      this.locale = this.sessionService.getItem("local-language");
    }
    scroll(to: string) {
      const element = document.getElementById(to);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
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
