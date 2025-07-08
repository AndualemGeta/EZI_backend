import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import etDate, { getEthiopianTime } from "../../assets/js/getEthiopianDate.js";
@Injectable({ providedIn: 'root' })
export class EthiopianDateService {
  constructor(private translate: TranslateService,
    private datePipe: DatePipe,
  ) {}
 public convertToEthiopianDate(gregorianInput: Date | string): string {
    if ( !this.translate.currentLang || this.translate.currentLang=='en'){
      return this.datePipe.transform(gregorianInput, 'MMM d, y') ?? '';
    };
    const gDate = new Date(gregorianInput);
    if (isNaN(gDate.getTime())) return '';
     return etDate(gDate);
  }

public convertToEthiopianTime(gregorianInput: Date | string): string {
  if (!this.translate.currentLang || this.translate.currentLang=='en'){
      return this.datePipe.transform(gregorianInput, 'h:mm a') ?? '';
    };
    const gDate = new Date(gregorianInput);
    if (isNaN(gDate.getTime())) return '';
     return getEthiopianTime(gDate);
  }
}
