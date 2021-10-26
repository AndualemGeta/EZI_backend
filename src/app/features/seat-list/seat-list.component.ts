import {Component, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { TicketPrintService } from 'src/app/Service/ticket-print.service';
import {MatStepper} from '@angular/material/stepper';
import {PassengerTicketPrintService} from '../../Service/passenger-ticket-print.service';
enum CheckBoxType { APPLY_FOR_JOB, MODIFY_A_JOB, NONE };
@Component({
  selector: 'app-seat-list',
  templateUrl: './seat-list.component.html',
  styleUrls: ['./seat-list.component.css'],providers: [{
  provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class SeatListComponent  {
  responseDialog: boolean;
  iserror: boolean;
  disableSubmit: boolean;
  responseMesssage: any;
  responseStyle:string;
   responseTitle:string;
   seatConfig: any = null;
   submitted:boolean;
   seatmap = [];
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
  agentId: string;
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
  // Only required when not passing the id in methods
  @ViewChild('stepper') private myStepper: MatStepper;

  check_box_type = CheckBoxType;
  currentlyChecked: CheckBoxType;
  constructor(private routeStateService: RouteStateService, private router: Router,
    private _formBuilder: FormBuilder,
    private eziService: EziBusService,
    private _snackBar : MatSnackBar,
    private printService: TicketPrintService,
              private  ticketPrintService : PassengerTicketPrintService
    ) { }
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    dynamicForm: FormGroup;
  newPassanger={
    registrationDate: new Date(),
    updatedAt: new Date(),
    scheduleId: "",
    accountId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    paymentMethodCode: "",
    paymentProviderCode: "",
    debitAccount: "",
    passengers: [],
    bookedById: "DE937EB1-F20A-44E5-451C-08D8A705F255",
    statusCode: 'Reserved',
    paymentTypeCode: 'Electronic',
  }
  ngOnInit(): void {
    this.loading=false;
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
    this.getAllLocations();
    this.getAllBankAccounts();
    this.agentId = 'DE937EB1-F20A-44E5-451C-08D8A705F255';
    this.routeState = this.routeStateService.getCurrent().data;
      this.selectedTrip=this.routeState;
    this.seatConfig = [
      {
        seat_price:this.selectedTrip.price,
        seat_map: [
          {
            seat_label: "1",
            layout: "gg_gg"
          },
          {
            seat_label: "2",
            layout: "gg_gg"
          },
          {
            seat_label: "3",
            layout: "gg_gg"
          },
          {
            seat_label: "4",
            layout: "gg_gg"
          },
          {
            seat_label: "5",
            layout: "gg_gg"
          },
          {
            seat_label: "6",
            layout: "gg_gg"
          },
          {
            seat_label: "7",
            layout: "gg_"
          },
          {
            seat_label: "8",
            layout: "gg_gg"
          },
          {
            seat_label: "9",
            layout: "gg_gg"
          },
          {
            seat_label: "10",
            layout: "gg_gg"
          },
          {
            seat_label: "11",
            layout: "gg_gg"
          },
          {
            seat_label: "12",
            layout: "gg_gg"
          },
          {
            seat_label: "13",
            layout: "ggggg"
          }
        ]
      }
    ];
  this.processSeatChart(this.seatConfig);
    for(let z=1;z<=this.selectedTrip.seatCapacity;z++){
      let seat=this.selectedTrip.availableSeats.filter(x => x == z).length
      if(seat==0){
        this.ReservedSeats.push(z);
          }
    }
  this.blockSeats(this.ReservedSeats);
  }

  public processSeatChart(map_data: any[]) {
    if (map_data.length > 0) {
      var seatNoCounter = 1;
      for (let __counter = 0; __counter < map_data.length; __counter++) {
        var row_label = "";
        var item_map = map_data[__counter].seat_map;
         row_label = "Row " + item_map[0].seat_label + " - ";
        if (item_map[item_map.length - 1].seat_label != " ") {
          row_label += item_map[item_map.length - 1].seat_label;
        } else {
          row_label += item_map[item_map.length - 2].seat_label;
        }
        row_label += " : Birr " + map_data[__counter].seat_price;
        item_map.forEach(map_element => {
          var mapObj = {
            seatRowLabel: map_element.seat_label,
            seats: [],
            seatPricingInformation: row_label
          };
          row_label = "";
          var seatValArr = map_element.layout.split("");
          if (this.seatChartConfig.newSeatNoForRow) {
            seatNoCounter = 1; //Reset the seat label counter for new row
          }
          var totalItemCounter = 1;
          seatValArr.forEach(item => {
            var seatObj = {
              key: map_element.seat_label + "_" + totalItemCounter,
              price: map_data[__counter]["seat_price"],
              status: "available"
            };

            if (item != "_") {
              seatObj["seatLabel"] =
                map_element.seat_label + " " + seatNoCounter;
              if (seatNoCounter < 10) {
                seatObj["seatNo"] = "0" + seatNoCounter;
              } else {
                seatObj["seatNo"] = "" + seatNoCounter;
              }

              seatNoCounter++;
            } else {
              seatObj["seatLabel"] = "";
              seatObj["seatNo"] = "" ;
            }
            totalItemCounter++;
            mapObj["seats"].push(seatObj);
          });
          this.seatmap.push(mapObj);
        });
      }
    }
  }
 public selectSeat(seatObject: any) {
 if (seatObject.status == "available") {
      // if(this.cart.selectedSeats.length>=3){
      //  this.showMessage("You Can not reserve more than 3 seats if you want more Call 9293");
      //   return false;
      //       }
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
  this._snackBar.open(message,"OK");
}
AddNUmberOfPassengers(e) {
  const numberOfTickets = e || 0;
  if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
          this.t.push(this._formBuilder.group({
              name: ['', Validators.required],
              phone:['', [Validators.required, Validators.pattern(new RegExp("[0-9 ]{10}"))]],
              laggage: [0, Validators.required],
          }));
      }
  } else {
      for (let i = this.t.length; i >= numberOfTickets; i--) {
          this.t.removeAt(i);
      }
  }
}
onSubmit() {
  this.submitted = true;
  if (this.dynamicForm.invalid) {
    this.showMessage("Please fill all passenger information first");
    return;
  }
  this.newPassanger.passengers=[];
  this.newPassanger.scheduleId=this.selectedTrip.scheduleId;
  let v=this.dynamicForm.value;
  if (v.tickets.length<=0) {
    this.showMessage("Please select seat first");
    return;
  }
  for(let i=0;i<v.tickets.length;i++){
    let newPassengerData={
    charges: this.selectedTrip.price,
     discount: 0,
     seatNumber: this.cart.selectedSeats[i],
     luggageWeight: 0,
     pickupLocation: "mexico shebelie",
     passenger: {
       phoneNumber: v.tickets[i].phone,
       fullName: v.tickets[i].name,
       gender: "Male",
       age: 0
     }
    }
    this.newPassanger.passengers.push(newPassengerData);
    }
  if(this.paymentMethod == 'BankTransfer'){
    this.newPassanger.paymentMethodCode = 'BankTransfer'
    this.newPassanger.accountId = this.accountId;
    this.newPassanger.paymentProviderCode = null;
    if(this.newPassanger.accountId==""){
      this.showMessage("Please select Bank account you want to pay");
      return false;
    }
  }
  if(this.paymentMethod == 'TeleBirr'){
    this.newPassanger.paymentMethodCode = 'Electronic';
    this.newPassanger.paymentProviderCode = 'TeleBirr';
    this.newPassanger.accountId = null;
  }
  if(this.paymentMethod == "AwashOtp"){
    this.newPassanger.paymentMethodCode = 'Electronic';
    this.newPassanger.paymentProviderCode = 'AwashOtp';
    this.newPassanger.accountId = null;
    this.newPassanger.debitAccount = this.dynamicForm.getRawValue().debitAccount;
    if(this.newPassanger.debitAccount == ''){
      this.showMessage("Please enter your awash bank account");
      return false;
    }
    console.log(this.newPassanger);
  }
   this.reserveSeat(this.newPassanger);
  }
  onReset() {
    this.dynamicForm.reset();
    this.t.clear();
  }

  onClear() {
    this.t.reset();
  }

  getAllLocations() {
    this.eziService.getAllLocations().then((value) => {
      this.cities = value;
    });
  }

  getAllBankAccounts() {
    this.eziService.getOperatorAccounts().then((response) => {
      this.accounts = response;
    });
  }

  changeGender(Value) {
    if(Value=="BankTransfer"){
      this.paymentMethod = 'BankTransfer';
    }
    else if(Value=='TeleBirr'){
      this.paymentMethod = 'TeleBirr';
    }
    else if(Value == 'AwashOtp'){
      this.paymentMethod = 'AwashOtp';
    }
  }
reserveSeat(data){
    this.loading = true;
  this.eziService.reserveMultiple(data).subscribe(
    (res) => {
    // console.log(res);
      this.iserror = false;
       this.responseDialog = true;
       // this.dynamicForm.reset();
      this.display = false;
      this.disableSubmit = false;
      this.showMessage('You have successfully reserved a trip. You will receive SMS shortly. ');
      this.loading = false;
      if(data['paymentMethodCode'] == "Electronic" && data["paymentProviderCode"] == "TeleBirr"){
          window.open(res["paymentDetails"],"_self");
        this.dynamicForm.reset();
      }
      else if(data['paymentMethodCode'] == 'Electronic' && data['paymentProviderCode'] == 'AwashOtp'){
        console.log(res);
        this.reservation = res;
        this.myStepper.next();
      }
      else{
       this.printData(res);
       this.router.navigate(["home"]);
        this.dynamicForm.reset();
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


selectCheckBox(targetType) {
  console.log(targetType);
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
  //this.router.navigate(["trip-list"]);
}
printData(selectedData) {
  this.printService.generatePassengerTicketPDF(selectedData);
}

  confirmOtp() {
    var values = this.awashOtpForm.getRawValue();
    console.log(values);
    var data = {
      billCode : this.reservation.billCode,
      reservationId : this.reservation.reservationId,
      otp : values.otp,
      phoneNumber : values.phoneNumber
    }

    this.loading = true;
    this.eziService.confirmAwashOtp(data).subscribe((res) => {
      console.log(res);
      this.showMessage('You have successfully reserved a trip. You will receive SMS shortly. ');
      this.loading = false;
      if(res.length > 0){
        res.map((passData) => {
          this.ticketPrintService.generatePDF(passData);
        })
      }
      // this.router.navigate(["home"]);

    },(error) => {
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
    })
  }


  testPrint(){
    var data = [
      {
        "transactionId": "6ddf6eb4-a882-4524-a14e-08d98e2a6e45",
        "ticketId": "079f6512-5594-45cb-b20f-0910b0a8d5b1",
        "scheduleId": "fbae504b-c169-4510-6a45-08d98ddc4b7a",
        "checkedIn": false,
        "charges": 15,
        "discount": 0,
        "commission": 0,
        "seatNumber": 33,
        "luggageWeight": 0,
        "registrationDate": "2021-10-13T09:19:53.25939",
        "updatedAt": "2021-10-13T09:19:53.2593903",
        "pickupLocation": "mexico shebelie",
        "schedule": {
          "scheduleId": "fbae504b-c169-4510-6a45-08d98ddc4b7a",
          "seatCapacity": 51,
          "isActive": true,
          "tripDate": "2021-10-20T00:00:00",
          "departureTime": "2021-10-20T05:30:00",
          "checkinTime": "2021-10-20T05:00:00",
          "description": null,
          "createdAt": "2021-10-13T04:07:04.5358562",
          "updatedAt": "2021-10-13T04:07:04.5358581",
          "availableSeats": null,
          "lineId": "7e7a815c-7489-4d15-24cc-08d8c068dd51",
          "operatorId": "ede90f84-3c4b-419a-2d71-08d8a67654fd",
          "busId": "eca2ac21-7850-4bd9-8dd8-08d8d258f5e0",
          "parentScheduleId": null,
          "departureLocation": "Addis Ababa",
          "departureStation": "Autobus Tera Terminal",
          "arrivalLocation": "ArbaMinch",
          "arrivalStation": "Terminal 1",
          "operator": "GHION",
          "operatorSupportPhoneNumber": "0956939393",
          "busSideNumber": "GB12",
          "busPlateNumber": "A12345",
          "price": 0,
          "agentName": "tsedeniya Ghion",
          "driverName": "k/mariam g/cherkos",
          "driverId": "86ce72cb-5d52-43e6-fadd-08d8b864324a",
          "agentId": "a6e9dd1e-e0cb-4d7a-4520-08d8a705f255",
          "departureLocationId": "ba8fcf90-31de-420f-68ac-08d8a643ea62",
          "arrivalLocationId": "839c3a7f-c636-485e-b84d-a9dcc30fec14",
          "departureLocationPhone": "0956939393",
          "arrivalLocationPhone": "0956939393",
          "displayName": "Addis Ababa - ArbaMinch / 10/20/2021"
        },
        "passenger": {
          "passengerId": "d6a4391d-8ab2-48f9-527a-08d98e2a6e4a",
          "phoneNumber": "0910179448",
          "fullName": "Mikiyas Abraham",
          "gender": "Male",
          "age": 0,
          "registrationDate": "0001-01-01T00:00:00",
          "transactions": []
        },
        "bookedBy": {
          "agentId": "de937eb1-f20a-44e5-451c-08d8a705f255",
          "address": "Addis Ababa",
          "stateId": "001",
          "homeNumber": "1300",
          "kebele": "13",
          "woreda": "13",
          "city": "Addis Ababa",
          "currentBalance": 0,
          "userId": "d902a54b-b2ce-4cd8-be83-82259a909115",
          "operatorId": "ede90f84-3c4b-419a-2d71-08d8a67654fd",
          "superAgentId": null,
          "fullName": "Senait geberab",
          "smsEnabled": true
        },
        "updatedBy": {
          "agentId": "de937eb1-f20a-44e5-451c-08d8a705f255",
          "address": "Addis Ababa",
          "stateId": "001",
          "homeNumber": "1300",
          "kebele": "13",
          "woreda": "13",
          "city": "Addis Ababa",
          "currentBalance": 0,
          "userId": "d902a54b-b2ce-4cd8-be83-82259a909115",
          "operatorId": "ede90f84-3c4b-419a-2d71-08d8a67654fd",
          "superAgentId": null,
          "fullName": "Senait geberab",
          "smsEnabled": true
        },
        "statusCode": "Booked",
        "paymentTypeCode": "Electronic",
        "serial": {
          "serialNo": 1333,
          "serialCode": "G1333"
        }
      }
    ]

    this.ticketPrintService.generatePDF(data[0]);
  }
}

