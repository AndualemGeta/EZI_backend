import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { PaymentService } from 'src/app/Service/Payment-service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-payment-phone',
  templateUrl: './payment-phone.component.html',
  styleUrls: ['./payment-phone.component.css']
})
export class PaymentPhoneComponent implements OnInit {
    loading: boolean;
    responseDialog: boolean;
    iserror: boolean;
    disableSubmit: boolean;
    responseMesssage: any;
    responseStyle:string;
    responseTitle:string;
    routeState;
    reservation;
    phoneNumber: string = '';	
    ArifPaycreateSessionData = {
      cancelUrl: "https://ezibus.leapfrogtechafrica.com/book-bus-tickets-in-ethiopia",
      phone: "",
      email: "telebirrTest@gmail.com",
      nonce:'' ,
      errorUrl: "https://leapfrogtechafrica.com/about-us.html",
      notifyUrl: "https://leapfrogtechafrica.com/",
      successUrl: "https://www.ezipublic.ezi-tech.com/book-bus-tickets-in-ethiopia",
      paymentMethods: [],
      expireDate: "2025-02-01T03:45:27",
      items: [
        {
          name: "EZI BUS",
          quantity: 1,
          price: 2,
          description: "EZI BUS SYSTEM",
          image: "https://ezibus.leapfrogtechafrica.com/assets/img/ezi-icon.png"
        }
      ],
      beneficiaries: [
        {
          accountNumber: "01320811436100",
          bank: "AWINETAA",
          amount: 0.0
        }
      ],
      lang: "EN"
    };

   constructor(private routeStateService: RouteStateService, private router: Router,
    private eziService: EziBusService, private paymentService: PaymentService, private _snackBar : MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.routeState = this.routeStateService.getCurrent().data;
    this.reservation=this.routeState;
    console.log(this.reservation);
    console.log(this.reservation.passengers);
  }
  showMessage(message){
    this._snackBar.open(message,"OK");
  }

  submitPhoneNumber() {
    console.log(this.phoneNumber);
    const updatedItems = this.generateUpdatedItems(this.reservation.passengers);
    if (this.phoneNumber) {
      this. ArifPaycreateSessionData.phone = "251" + this.phoneNumber.substring(1);
      this.ArifPaycreateSessionData.expireDate = this.getExpireDate();
      this.ArifPaycreateSessionData.paymentMethods=[this.reservation.PaymentOption]
      this.ArifPaycreateSessionData.items = updatedItems;
      this.ArifPaycreateSessionData.beneficiaries[0].amount =this.reservation.totalPrice;
      console.log(this. ArifPaycreateSessionData);
      this.ArifPaycreateSessionData.nonce=(Math.floor(Math.random() * 900000000000) + 1000000000).toString();
      this.checkoutSession(this.ArifPaycreateSessionData);
      // Navigate to the next page and pass the phone number as a query parameter
      //this.reserveSeat(this.reservation);
    }
  }

  reserveSeat(data){
    this.loading = true;
    this.eziService.reserveMultiple(data).subscribe(
      (res) => {
        this.iserror = false;
         this.responseDialog = true;
         this.loading = false;
         this.routeStateService.add("user-list","/book-result",res,false);
        },
      (error) => {
        this.iserror = true;
        this.responseTitle = 'Error!!!';
        this.responseDialog = true;
        this.responseMesssage = '';
        this.responseStyle = 'error';
        this.disableSubmit = false;
        for (const [key, value] of Object.entries(error)) {
          this.responseMesssage = this.responseMesssage + value;
        }
        this.loading = false;
        this.showMessage(this.responseMesssage);
      }
    );
  }

  checkoutSession(data){
    this.loading = true;
    this.paymentService.createSession(data).subscribe(
      (res) => {
        console.log(res.data);
        this.iserror = false;
         this.responseDialog = true;
         this.loading = false;
         this.routeStateService.add("user-list","/book-result",res,false);
        },
      (error) => {
        console.log(error);
        this.iserror = true;
        this.responseTitle = 'Error!!!';
        this.responseDialog = true;
        this.responseMesssage = '';
        this.responseStyle = 'error';
        this.disableSubmit = false;
        for (const [key, value] of Object.entries(error)) {
          this.responseMesssage = this.responseMesssage + value;
        }
        this.loading = false;
        this.showMessage(this.responseMesssage);
      }
    );
  }

   getExpireDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); 
    return now.toISOString(); 
  };

 generateUpdatedItems(passengerData: any[]) {
    return passengerData.map((data) => ({
      name: data?.passenger?.fullName|| "EZI BUS",
      quantity: 1,
      price: data?.charges - data?.discount|| 0, // Adjust price based on discount
      description: `Seat: ${data.seatNumber}, Pickup: ${data.pickupLocation}`,
      image: "https://ezibus.leapfrogtechafrica.com/assets/img/ezi-icon.png"
    }));
  }


}
