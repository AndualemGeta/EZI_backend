import { Injectable } from '@angular/core';
import { alert } from 'hylid-bridge';

@Injectable({
  providedIn: 'root'
})
export class MiniProgramService {

  constructor() { }

  isMiniProgram(): boolean {
    return /MiniProgram/.test(navigator.userAgent);
  }

  /**
   * Use this method to block execution outside of MiniProgram with alert
   */
  blockIfNotInMiniProgram(): boolean {
    if (!this.isMiniProgram()) {
      alert({
        content: 'This feature can only be used inside the Super App Mini Program.',
        success: () => {
          console.warn('Blocked: Not running inside Mini Program');
        }
      });
      return true; // blocked
    }
    return false; // allowed
  }
}
