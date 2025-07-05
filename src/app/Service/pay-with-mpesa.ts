import { Injectable } from '@angular/core';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { call, alert } from 'hylid-bridge';
import { environment } from '../../environments/environment';
import {RouteStateService } from 'src/app/Service/route-state.service';
import { MiniProgramService } from 'src/app/Service/mini-program-service';
@Injectable({
  providedIn: 'root'
})
export class MpesaPaymentService {
  private mpesaMiniconstants = {
    businessID: environment.businessID,
    billReference: '123456789',
    currency: 'ETB',
    reason: environment.reservation_reason
  };

  logdata={
  merchantRequestID: "string",
  businessShortCode: environment.businessID,
  phoneNumber: "string",
  amount: 0,
  transactionFrom: "string",
  oPeratorReference: "string",
  status: "string",
  callbackMetadata:{}
  }
  constructor(private eziBusService: EziBusService,private routeStateService: RouteStateService,private miniProgramService: MiniProgramService) {}
  payWithMpesa(reservation): Promise<void> {
  return new Promise((resolve, reject) => {
    let data = reservation.data;
    if (!data || !data.reservationId || !data.totalPrice) {  
      alert({ content: 'Invalid payment data. Please try again.' });
      reject('Invalid payment data');
      return;
    }
 call('payWithMpesa', {
      businessID: this.mpesaMiniconstants.businessID,
      billReference: data.billCode,
      amount: data.totalPrice,
      currency: 'ETB',
      reason: this.mpesaMiniconstants.reason,
      success: (res: any) => {
        this.logdata.status = 'success';
        this.logdata.merchantRequestID = data.reservationId;    
        this.logdata.amount = data.totalPrice;
        this.logdata.transactionFrom = res.transactionId; 
        data.transactionId = res.transactionId;
        this.logdata.oPeratorReference = data.billCode; 
        this.logOnline(this.logdata);
        this.routeStateService.add("user-list", "/book-result", data, false);
        alert({content: 'Payment successful! Your bus ticket has been confirmed.' });
        resolve();
      },
      fail: (res: any) => {
        this.logdata.status = 'fail';
        this.logdata.merchantRequestID = data.reservationId;    
        this.logdata.amount = data.totalPrice;
        this.logdata.transactionFrom = res.errorMessage; 
        this.logdata.oPeratorReference = data.reservationId; 
        this.logOnline(this.logdata);
        this.routeStateService.add("user-list", "/book-failed", {}, false);
        alert({
        content: 'Payment failed: Please try again or contact support.',
      });
        reject(res.errorMessage); 
      },
    });
  });
}

  private logOnline(data) {
    this.eziBusService.add_transaction_log(data).subscribe(
      (res) => {
       // console.log('Reservation success:', res);
        // You can emit events or return observables for UI feedback if needed
      },
      (error) => {
       // console.error('Reservation error:', error);
      }
    );
  }
}
