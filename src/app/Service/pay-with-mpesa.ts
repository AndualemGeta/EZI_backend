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
  payWithMpesa(reservation) {
  // const blocked = this.miniProgramService.blockIfNotInMiniProgram();
  //   if (blocked) return;
    const data = reservation.data;
    // console.log('payWithMpesa called with reservation:', data.transactions);
    if (!data || !data.reservationId || !data.totalPrice) {  
      alert({ content: 'Invalid payment data. Please try again.' });
      return;
    }
    call('payWithMpesa', {
      businessID: this.mpesaMiniconstants.businessID,
      billReference: data.reservationId,
      amount: data.totalPrice,
      currency: 'ETB',
      reason: this.mpesaMiniconstants.reason,
      success: (res: any) => {
        alert({ content: JSON.stringify(res) });
        this.logdata.status = 'success';
        this.logdata.merchantRequestID = data.reservationId;    
        this.logdata.amount = data.totalPrice;
        this.logdata.transactionFrom = res.transactionId; 
        this.logOnline(this.logdata);
        console.log('Payment Success', res);
        this.routeStateService.add(
          "user-list",
          "/book-result",
          res,
          false
        );
      },
      fail: (res: any) => {
        alert({ content: JSON.stringify(res) });
        this.logdata.status = 'fail';
        this.logdata.merchantRequestID = data.reservationId;    
        this.logdata.amount = data.totalPrice;
        this.logdata.transactionFrom =  res.errorMessage;  
        this.logOnline(this.logdata);
        console.error('Payment Failed', res);
      },
    });
  }

  private logOnline(data) {
    this.eziBusService.add_transaction_log(data).subscribe(
      (res) => {
        console.log('Reservation success:', res);
        // You can emit events or return observables for UI feedback if needed
      },
      (error) => {
        console.error('Reservation error:', error);
      }
    );
  }
}
