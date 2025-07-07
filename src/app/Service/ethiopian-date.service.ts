import { Injectable } from '@angular/core';
import { toEC } from 'ethiopian-date'; // <-- imported from the library

@Injectable({ providedIn: 'root' })
export class EthiopianDateService {
  private readonly MONTH_NAMES_AM = [
    'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሳስ', 'ጥር',
    'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ',
    'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ];

  public convertToEthiopianString(gregorianInput: Date | string): string {
    const gDate = new Date(gregorianInput);
    if (isNaN(gDate.getTime())) return '';

    // Use the trusted library
    const { year, month, date: day } = toEC(gDate);

    // Time formatting
    const gHour = gDate.getHours();
    const gMinute = gDate.getMinutes().toString().padStart(2, '0');
    const ethHour24 = (gHour + 6) % 24;
    const ethHour12 = (ethHour24 % 12) || 12;
    const timeLabel = this.getTimeOfDayLabel(ethHour24);

    const monthName = this.MONTH_NAMES_AM[month - 1] || 'ወር';
    return `${monthName} ${day}, ${year} ${ethHour12}:${gMinute} ${timeLabel}`;
  }

  private getTimeOfDayLabel(hour: number): string {
    if (hour >= 0 && hour < 6) return 'ሌሊት';
    if (hour >= 6 && hour < 12) return 'ጠዋት';
    if (hour >= 12 && hour < 15) return 'ቀን';
    if (hour >= 15 && hour < 18) return 'ከሰዓት';
    return 'ማታ';
  }
}
