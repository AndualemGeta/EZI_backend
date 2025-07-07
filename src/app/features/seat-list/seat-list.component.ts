import {Component, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router } from '@angular/router';
import {EziBusService } from 'src/app/Service/ezibus-apiservice';
import {PaymentService } from 'src/app/Service/Payment-service';
import {RouteStateService } from 'src/app/Service/route-state.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TicketPrintService } from 'src/app/Service/ticket-print.service';
import {MatStepper} from '@angular/material/stepper';
import {PassengerTicketPrintService} from '../../Service/passenger-ticket-print.service';
import {getSeatConfig,ReservationBody,setPaymentDetails,PAYMENT_OPTIONS,ArifPaycreateSessionData,arifPayCheckoutBbody} from '../../utils/constants';
import { processSeatChart } from 'src/app/utils/seat-list-utils';
import { Observable } from 'rxjs';
import { MpesaPaymentService } from '../../Service/pay-with-mpesa';
import { MiniProgramService } from '../../Service/mini-program-service';
import { SeatFormValidators} from 'src/app/utils/seat-form-validator';
import { EthiopianDateService } from 'src/app/Service/ethiopian-date.service';
enum CheckBoxType { APPLY_FOR_JOB, MODIFY_A_JOB, NONE };
@Component({
  selector: 'app-seat-list',
  templateUrl: './seat-list.component.html',
  styleUrls: ['./seat-list.component.css'],providers: [{
  provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class SeatListComponent  {
 @ViewChild('stepper') private myStepper: MatStepper;
   paymentOptions = PAYMENT_OPTIONS;
   ArifPaycreateSessionData = ArifPaycreateSessionData;
   paymentProviderDetail: any;
   selectedPayment: string = 'CBE';
  responseDialog: boolean;
  iserror: boolean;
  disableSubmit: boolean;
  responseMesssage: any;
  responseStyle:string;
   responseTitle:string;
   seatConfig: any = null;
   seatmap = [];
   phoneNumber: string = '';	
   seatChartConfig = {
    showRowsLabel: false,
    showRowWisePricing: false,
    newSeatNoForRow: false
  };
 
  ReservedSeats=[];
   cart = {
    selectedSeats: [],
    seatstoStore: [],
    totalamount: 0,
    cartId: "",
    eventId: 0
  };
  display: boolean;
  cities: any[];
  Trip: any;
  selectedCity: any;
  selectedTrip: any;
  accounts: any[];
  routeState;
  reserveRegisterForm: FormGroup;
  awashOtpForm : FormGroup;
  disableReservebutton: boolean;
  loading: boolean;
  paymentMethod : string="TeleBirr";
  accountId : string = "";
  debitAccount : string = "";
  awashOtp : string;
  awashPhoneNumber : string;
  reservation: any;
  check_box_type = CheckBoxType;
  currentlyChecked: CheckBoxType;
  constructor(private routeStateService: RouteStateService,private paymentService: PaymentService, private router: Router,
    private _formBuilder: FormBuilder,
    private eziService: EziBusService,
    private _snackBar : MatSnackBar,
    private printService: TicketPrintService,
    private payWithMpesa: MpesaPaymentService,
    private miniProgramService: MiniProgramService,
    public etDate: EthiopianDateService
    ) { }

    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    dynamicForm: FormGroup;
    newPassanger=ReservationBody;
  ngOnInit(): void {
    this.loading=false;
    this.routeState = this.routeStateService.getCurrent()?.data;
    if (!this.routeState || !this.routeState?.scheduleId) {
      this.router.navigate(['/trip-list']); 
      return;
    }
    this.selectedTrip=this.routeState;
    this.newPassanger.bookedById=this.routeState.agentId;
    this.newPassanger.accountId=this.routeState.reservationBankAccountsId;
    this.dynamicForm  =this._formBuilder.group({
      tickets: new FormArray([]),
      accountId: ['', []],
      paymentMethod : ['TeleBirr', Validators.required],
      seatNumber:[this.cart.selectedSeats],
      debitAccount : ['',[]]
     });

    this.awashOtpForm = this._formBuilder.group({
      phoneNumber : ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      otp : ['', Validators.required]
    });
    this.display = false;
   
    this.seatConfig = getSeatConfig(this.selectedTrip.price);
    processSeatChart(this.seatConfig, this.seatChartConfig, this.seatmap);
    for(let z=1;z<=51;z++){
      let seat=this.selectedTrip.availableSeats.filter(x => x == z).length
      if(seat==0){
        this.ReservedSeats.push(z);
          }
    }
  this.blockSeats(this.ReservedSeats);
  
  }

 
 public selectSeat(seatObject: any) {
 if (seatObject.status == "available") {
    if (this.cart.selectedSeats.length >= 3) {
  this.showMessage("You can reserve a maximum of 3 seats at a time. For group bookings or additional seats, please contact our support team.");
  return false;
   }

      seatObject.status = "booked";
      this.cart.selectedSeats.push(seatObject.seatNo);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
      this.AddNUmberOfPassengers(this.cart.selectedSeats.length);
      } else if((seatObject.status = "booked")) {
      seatObject.status = "available";
      var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatNo);
      if(seatIndex > -1) {
        this.cart.selectedSeats.splice(seatIndex, 1);
        this.cart.seatstoStore.splice(seatIndex, 1);
        this.cart.totalamount -= seatObject.price;
      }
      this.AddNUmberOfPassengers(this.cart.selectedSeats.length);
     }
  }
public blockSeats(seatsToBlock) {
    if (seatsToBlock != "") {
      let xseat=[];
       for (let index2 = 0; index2 < this.seatmap.length; index2++) {
        const element = this.seatmap[index2];
       for (let i2 = 0; i2 < element.seats.length; i2++){
          xseat.push(element.seats[i2]);
         }
       }
      for (let i = 0; i < xseat.length; i++){
        for (let r = 0; r < seatsToBlock.length; r++){
          if(xseat[i].seatNo==seatsToBlock[r]){
            xseat[i].status="unavailable";
            break;
          }
        }
      }
    }
  }
//convenience getters for easy access to form fields
get f() { return this.dynamicForm.controls; }
get t() { return this.f.tickets as FormArray; }
showMessage(message){
  this._snackBar.open(message,"", {
  duration: 4000,
  verticalPosition: 'top',        
  horizontalPosition: 'center',   
}
);
}
AddNUmberOfPassengers(e) {
  const numberOfTickets = e || 0;
  if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
          this.t.push(this._formBuilder.group({
              name: ['', [Validators.required, SeatFormValidators.fullNameValidator]],
              phone:['', [Validators.required, Validators.pattern(new RegExp("[0-9 ]{10}"))]],
              laggage: [null, [SeatFormValidators.luggageValidator]],
          }));
      }
  } else {
      for (let i = this.t.length; i >= numberOfTickets; i--) {
          this.t.removeAt(i);
      }
  }
}

onReset() {
    this.dynamicForm.reset();
    this.t.clear();
  }

  onClear() {
    this.t.reset();
  }


getAllBankAccounts(OperatorId: string): Promise<string> {
   if (this.accounts?.length > 0) {
    return Promise.resolve(this.accounts[0]?.reservationBankAccountsId || '');
  }
  return this.eziService.getOperatorAccounts(OperatorId)
    .then((response) => {
      this.accounts = response;
      return this.accounts[0]?.reservationBankAccountsId || '';
    })
    .catch((error) => {
      console.error('Failed to get accounts:', error);
      return '';
    });
}

  
reserveSeat(data){
  this.loading = true;
  this.eziService.reserveMultiple(data).subscribe(
    (res) => {
      this.iserror = false;
       this.responseDialog = true;
       this.dynamicForm.reset();
      this.display = false;
      this.disableSubmit = false;
      this.showMessage('You have successfully reserved a trip. You will receive SMS shortly. ');
      this.loading = false;
      if(data['paymentMethodCode'] == "Electronic" && data["paymentProviderCode"] == "TeleBirr"){
          window.open(res["paymentDetails"],"_self");
        this.dynamicForm.reset();
      }
      else if(data['paymentMethodCode'] == 'Electronic' && data['paymentProviderCode'] == 'AwashOtp'){
        this.reservation = res;
        this.myStepper.next();
      }
      else{
       this.routeStateService.add(
        "user-list",
        "/book-result",
        res,
        false
      );
      }
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
      this.display = false;
      this.loading = false;
      this.showMessage(this.responseMesssage);
    }
  );
}

async reserveMultipleSeat(data): Promise<{ success: boolean; data?: any; error?: any }> {
  this.loading = true;
  return new Promise((resolve) => {
    this.eziService.reserveMultiple(data).subscribe(
      (res) => {
        resolve({ success: true, data: res });
      },
      (error) => {
        this.loading = false;
        let errorMessage = "";
        for (const value of Object.values(error)) {
          errorMessage += value;
        }
        resolve({ success: false, error: errorMessage });
      }
    );
  });
}

selectCheckBox(targetType) {
  // If the checkbox was already checked, clear the currentlyChecked variable
  // if(this.currentlyChecked === targetType) {
  //   this.currentlyChecked = CheckBoxType.NONE;
  //   return;
  // }
   this.currentlyChecked = targetType;
  // console.log(this.currentlyChecked);
}

BackToTripList(){
  let searchData={
    destination:this.routeState.arrivalLocationId,
    departure:this.routeState.departureLocationId,
    tripDate:this.routeState.tripDate
  };
  this.routeStateService.add(
    "trip-list",
    "/trip-list",
    searchData,
    false
  );
}
printData(selectedData) {
  this.printService.generatePassengerTicketPDF(selectedData);
}
 
async mpesaMiniAppPayment(paymentName: string){
  this.loading=true;
  this.selectedPayment=paymentName;
  this.paymentProviderDetail=setPaymentDetails(paymentName);
  
  if (this.dynamicForm.invalid) {
    this.showMessage("Please fill all passenger information first");
    return;
  }
  this.newPassanger.passengers=[];
  let number_of_passengers=this.dynamicForm.value;
  if (number_of_passengers.tickets.length<=0) {
    this.showMessage("Please select seat first");
    return;
  }
  this.newPassanger.scheduleId=this.selectedTrip.scheduleId;
  this.newPassanger.totalPrice=this.selectedTrip.price*number_of_passengers.tickets.length;
 if (this.newPassanger.totalPrice <= 0) {
  this.showMessage("Please select a seat before proceeding.");
  return;
 }

  for(let i=0;i<number_of_passengers.tickets.length;i++){
    let newPassengerData={
    charges: this.selectedTrip.price,
     discount: 0,
     seatNumber: this.cart.selectedSeats[i],
     luggageWeight: 0,
     pickupLocation: "not set miniapp",
     passenger: {
       phoneNumber: number_of_passengers.tickets[i].phone,
       fullName: number_of_passengers.tickets[i].name,
       gender: "none",
       age: 0
     }
    }
    this.newPassanger.passengers.push(newPassengerData);
    }

  this.newPassanger.paymentProviderCode = this.paymentProviderDetail.paymentProviderCode || null ;
  this.newPassanger.PaymentOption=paymentName; 
  this.newPassanger.paymentMethodCode =  this.paymentProviderDetail.paymentMethodCode;

  try {
  const result = await this.reserveMultipleSeat(this.newPassanger);
      if (result.success) {
        //this.routeStateService.add("user-list", "/book-result", result.data, false);
         await this.payWithMpesa.payWithMpesa(result);
          } else {
         if (result.success === false && result.error) {
            this.showMessage(`Seat Reservation Failed ${result.error}`);
         }  
      else {    
         this.showMessage("Seat Reservation Failed. Please try again.");
       }
      }
       } 
      catch (error) {
       this.showMessage(`Payment Failed: ${error}`);
       } finally {
      this.loading = false;
  }
      
  }
  
  async proceedToPay() {
     this.loading = true;
    // const updatedItems = this.generateUpdatedItems(this.newPassanger.passengers);
    // const paymentPhone = "251" + this.phoneNumber.substring(1);
    // if (this.phoneNumber) {
    //   this.newPassanger.paymentNumber = paymentPhone;
    //   const result = await this.reserveMultipleSeat(this.newPassanger);
    //   if (result.success) {
    //     this.routeStateService.add(
    //         "user-list",
    //         "/payment-confirmation",
    //         result,
    //         false
    //       ); 
    //   } else {
    //      this.loading = false;
    //     this.showMessage("Seat Reservation Failed. Please try again.");
    //     console.error("Reservation Failed:", result.error);
    //   }
    // }
    // else{
    //    this.loading = false
    //     this.showMessage("Seat Reservation Failed. Please try again.");
    //     console.error("Reservation Failed: Pyament Phone Number is required");
    //   }
  }
  async handleCheckoutResult(data: any, phoneNumber: string) {
    try {
      this.loading = true;
      const res = await this.checkoutSession(data).toPromise();
     
       if(!res.error){
        const checkingOutData = arifPayCheckoutBbody(this.selectedPayment, res.data, phoneNumber);
        if (["AWASH", "AMOLE", "HELLOCASH"].includes(this.selectedPayment)){  
          // const PaymentCheckout = await this.paymentService.directPaymentCheckout(checkingOutData,this.selectedPayment);
           this.routeStateService.add(
            "user-list",
            "/payment-otp-confirmation",
            {res,paymentMethod:this.selectedPayment,sessionId:checkingOutData.sessionId},
            false
          );
        // console.log(PaymentCheckout);
        }
      else if(this.selectedPayment == "CBE"){
        // const PaymentCheckout = await this.paymentService.directPaymentCheckout(checkingOutData,this.selectedPayment);
          this.routeStateService.add(
            "user-list",
            "/payment-confirmation",
            res,
            false
          );
          // console.log(PaymentCheckout);
        }
      else{
          // await this.registerPayment(res.data).toPromise();
          this.routeStateService.add(
            "user-list",
            "/payment-confirmation",
            res,
            false
          );
        }
      }
      else{

        this.routeStateService.add(
          "user-list",
          "/book-result",
          res,
          false
        );
      }
      
    } catch (error) {
      console.error(error);
      this.responseMesssage = Object.values(error).join(' ') || 'An error occurred while processing your payment';
      this.showMessage(this.responseMesssage);
      this.disableSubmit = false;
      this.loading = false;
    }
    // this.loading = false;
  }
  
  checkoutSession(data): Observable<any> {
    return this.paymentService.createSession(data, this.selectedPayment);
  }

  getExpireDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); 
    return now.toISOString(); 
  }

  generateUpdatedItems(passengerData: any[]) {
    return passengerData.map((data) => ({
      name: data?.passenger?.fullName|| "EZI BUS",
      quantity: 1,
      price: data?.charges - data?.discount|| 0, // Adjust price based on discount
      description: `Seat: ${data.seatNumber}, Pickup: ${data.pickupLocation}`,
      image: "https://ezibus.leapfrogtechafrica.com/assets/img/ezi-icon.png"
    }));
  }

  getSelectedImage(): string {
    const option = this.paymentOptions.find(opt => opt.name === this.selectedPayment);
    return option ? option.img : '';
  }



}

