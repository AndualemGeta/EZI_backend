import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Injectable({ providedIn: 'root' })
export class EthiopianDateService {

  constructor(private translate: TranslateService,
    private datePipe: DatePipe,
  ) {}
  private readonly MONTH_NAMES_AM = [
    'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሳስ', 'ጥር',
    'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ',
    'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ];
  public convertToEthiopianDate(gregorianInput: Date | string): string {
    if (this.translate.currentLang=='en'){
      return this.datePipe.transform(gregorianInput, 'MMM d, y') ?? '';
    };
    const gDate = new Date(gregorianInput);
    if (isNaN(gDate.getTime())) return '';
    const ethDate = this.gregorianToEthiopian(gDate);
    // const gHour = gDate.getHours();
    // const gMinute = gDate.getMinutes().toString().padStart(2, '0');
    // const ethHour24 = (gHour) +6 % 24;
    // const ethHour12 = (ethHour24 % 12) || 12;
    // const timeLabel = this.getTimeOfDayLabel(gHour);
    const monthName = this.MONTH_NAMES_AM[ethDate.month - 1] || 'ወር';
    return `${monthName} ${ethDate.day}, ${ethDate.year}`;
  }

public convertToEthiopianTime(gregorianInput: Date | string): string {
    if (this.translate.currentLang=='en'){
      return this.datePipe.transform(gregorianInput, 'h:mm a') ?? '';
    };
    const gDate = new Date(gregorianInput);
    if (isNaN(gDate.getTime())) return '';
    const gHour = gDate.getHours();
    const gMinute = gDate.getMinutes().toString().padStart(2, '0');
    const ethHour24 = (gHour) +6 % 24;
    const ethHour12 = (ethHour24 % 12) || 12;
    const timeLabel = this.getTimeOfDayLabel(gHour);
    return `${timeLabel} ${ethHour12}:${gMinute}`;
  }

  private gregorianToEthiopian(date: Date): { year: number; month: number; day: number } {
    const jd = this.gregorianToJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const ethEpoch = 1723856;
    const days = jd - ethEpoch;

    const fourYearCycles = Math.floor(days / 1461);
    const remainingDays = days % 1461;

    let yearInCycle = Math.floor(remainingDays / 365);
    let dayOfYear = remainingDays % 365;

    if (yearInCycle === 4 || remainingDays === 1460) {
      yearInCycle = 3;
      dayOfYear = 365;
    }

    let year = fourYearCycles * 4 + yearInCycle + 1;

    // Manually fix the common offset problem
    const gMonth = date.getMonth() + 1;
    const gDay = date.getDate();
    if (gMonth >= 1 && gMonth <= 8) {
      year -= 1; // Correct offset before Meskerem (Ethiopian New Year)
    }

    let month: number, day: number;

    if (dayOfYear < 360) {
      month = Math.floor(dayOfYear / 30) + 1;
      day = (dayOfYear % 30) + 1;
    } else {
      const isLeap = year % 4 === 3;
      const pagumeDays = isLeap ? 6 : 5;
      month = 13;
      day = dayOfYear - 360 + 1;
      if (day > pagumeDays) {
        day = pagumeDays;
      }
    }

    return { year, month, day };
  }
  
  private gregorianToJulianDay(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) +
      365 * y + Math.floor(y / 4) -
      Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

public getTimeOfDayLabel(gHour: number) {
  let label = '';
  if (gHour >= 0 && gHour < 6) {
    label = 'ሌሊት';     
  } else if (gHour >= 6 && gHour < 12) {
    label = 'ጠዋት';     
  } else if (gHour >= 12 && gHour < 18) {
    label = 'ቀን';       
  } else {
    label = 'ማታ';       
  }
  return  label;
}
}
