import {Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import {FormGroup, FormControl, FormArray,Validators,FormBuilder} from '@angular/forms';
import {SessionService } from '../../Service/SessionService';
import {EziBusService } from '../../Service/ezibus-apiservice';
import {RouteStateService } from 'src/app/Service/route-state.service';
import {Location } from '@angular/common';
import {formatDate} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TicketPrintService } from 'src/app/Service/ticket-print.service';
@Component({
  selector: 'app-reserve-trip',
  templateUrl: './reserve-trip.component.html',
  styleUrls: ['./reserve-trip.component.css'],

})
export class ReserveTripComponent implements OnInit {
  dynamicForm: FormGroup;
  responseDialog: boolean;
  iserror: boolean;
  disableSubmit: boolean;
  responseMesssage: any;
  trip: any;
  noTrip: boolean;
  SearchResponse: any;
  responseTitle: string;
  selectedDestination: any;
  selectedDeparture: any;
  minDate: Date;
  maxDate: Date;
  userform: FormGroup;
  submitted = false;
  responseStyle;
  newLine: any = {};
  cities: any[];
  Trip: any;
  selectedCity: any;
  display: boolean;
  reserveRegisterForm: FormGroup;
  disableReservebutton: boolean;
  seatNo: any;
  AvailableSeat: any[];
  accounts: any[];
  selectedTrip: any;
  agentId: string;
  msgs: any;
  loading: boolean;
  routeState;
  paymentMethod : string;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private eziService: EziBusService,
    private routeStateService: RouteStateService,
    private location:Location,
    private _snackBar : MatSnackBar,
    private printService: TicketPrintService
  ) {}

  ngOnInit() {
    this.dynamicForm  =this.fb.group({
      numberOfTickets: ['1', Validators.required],
      tickets: new FormArray([])
  });
    this.routeState = this.routeStateService.getCurrent().data;
    this.selectedTrip=this.routeState;

    this.trip = false;
    this.loading = false;
    this.noTrip = false;
    this.disableReservebutton = false;
    this.disableSubmit = false;
    this.responseDialog = false;
    this.userform = this.fb.group({
    departure: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
    tripDate: new FormControl('', [Validators.required]),
    });
    this.reserveRegisterForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.required]],
      discount: [0, Validators.required],
      laggage: [0, Validators.required],
      seatNum: ['', Validators.required],
      accountId: ['', []],
      paymentMethod : ['', Validators.required]
    });
    this.display = false;
    this.getAllLocations();
    // this.getAllBankAccounts();
   // this.agentId = 'DE937EB1-F20A-44E5-451C-08D8A705F255';
    this.agentId='52c2ae4c-ea56-47e3-dee0-08dd8ae8ad79';
    var bankControl = this.reserveRegisterForm.get('accountId');
    this.reserveRegisterForm.get('paymentMethod').valueChanges.subscribe((value) => {
      if(value == 'BankTransfer')
      {
         bankControl.setValidators([Validators.required]);
      }
      else{
        bankControl.setValidators(null);
      }
    })
  }

  getAllLocations() {
    this.eziService.getAllLocations().then((value) => {
      this.cities = value;
    });
  }

  // getAllBankAccounts() {
  //   this.eziService.getOperatorAccounts().then((response) => {
  //     this.accounts = response;
  //   });
  // }
backFunction(){
   let searchData={
    departure:this.routeState.departureLocationId,
    destination:this.routeState.arrivalLocationId,
     tripDate: formatDate(this.routeState.tripDate,'yyyy-MM-dd', 'en-US')
   };
   this.routeStateService.add(
    "trip-list",
    "/trip-list",
    searchData,
    false
  );
  //this.location.back();
}
  onClickSearchLine() {
    this.loading = true;
    this.noTrip = false;
    this.disableReservebutton = false;
    let today = new Date().setHours(0, 0, 0, 0);
    let tripDate = new Date(this.userform.controls.tripDate.value).setHours(
      0,
      0,
      0,
      0
    );
    if (today > tripDate) {
      this.iserror = true;
      this.responseTitle = 'Error!!!';
      this.responseDialog = true;
      this.responseMesssage = 'please select future date';
      this.responseStyle = 'error';
      this.trip = false;
      this.noTrip = true;
      this.SearchResponse = 'Please select future date';
    } else {
      this.trip = true;
      this.disableSubmit = true;
      this.responseStyle = 'success';
      this.responseDialog = true;
      this.responseTitle = 'Info!!!';
      this.responseMesssage = 'No Trips Found';
      this.submitted = false;
      this.iserror = false;
      this.disableSubmit = false;
      var data = this.userform.getRawValue();
      this.eziService
        .search(
          data.operatorId,
          data.departure.locationId,
          data.destination.locationId,
          new Date(data.tripDate).toDateString()
        )
        .then((response) => {
          if (response.length === 0) {
            this.trip = false;
            this.SearchResponse = 'Trip not found';
            this.noTrip = true;
          }
          console.log(response);
          this.Trip = response;
          this.loading = false;
        });
    }
  }

  showMessage(message){
    this._snackBar.open(message,"UNDO");
  }

  get userFormControl() {
    return this.userform.controls;
  }

  reserve(){
    if(this.reserveRegisterForm.valid) {

      this.loading = true;
      var rawData = this.reserveRegisterForm.getRawValue();
      var data = {
        accountId: rawData.accountId,
        charges: this.selectedTrip.price,
        discount: 0,
        seatNumber: rawData.seatNum,
        luggageWeight: rawData.laggage,
        registrationDate: new Date(),
        updateAt: new Date(),
        scheduleId: this.selectedTrip.scheduleId,
        bookedById: this.agentId,
        statusCode: 'Reserved',
        paymentTypeCode: 'Electronic',
        pickupLocation: "mexico shebelie",
        passenger: {
          fullName: rawData.name,
          phoneNumber: rawData.phone,
          gender: 'Male',
          age: 0,
        },
      };
    if(rawData.paymentMethod == 'BankTransfer'){
      data['paymentMethodCode'] = 'BankTransfer'
    }
    if(rawData.paymentMethod == 'TeleBirr'){
      data['paymentMethodCode'] = 'Electronic';
      data['paymentProviderCode'] = 'TeleBirr';
    }
      this.eziService.reserve(data).subscribe(
        (res) => {
          this.iserror = false;
          this.responseStyle = 'success';
          this.responseDialog = true;
          this.responseTitle = 'SUCCESS!!!';
          this.responseMesssage =
            'You have successfully reserved a trip. You will receive SMS shortly. ';
          this.reserveRegisterForm.reset();
          this.display = false;
          this.disableSubmit = false;
          this.showMessage('You have successfully reserved a trip. You will receive SMS shortly. ');
          //  this.router.navigate(["home"]);
          this.loading = false;
          // this.printData(res);
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
  }
  printData(selectedData) {
    this.printService.generateSinglePassengerTicketPDF(selectedData);
  }

// convenience getters for easy access to form fields
get f() { return this.dynamicForm.controls; }
get t() { return this.f.tickets as FormArray; }

onChangeTickets(e) {
    const numberOfTickets = e.target.value || 0;
    if (this.t.length < numberOfTickets) {
        for (let i = this.t.length; i < numberOfTickets; i++) {
            this.t.push(this.fb.group({
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]]
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

  // stop here if form is invalid
  if (this.dynamicForm.invalid) {
      return;
  }

  // display form values on success
  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.dynamicForm.value, null, 4));
}


onReset() {
  // reset whole form back to initial state
  this.submitted = false;
  this.dynamicForm.reset();
  this.t.clear();
}

onClear() {
  // clear errors and reset ticket fields
  this.submitted = false;
  this.t.reset();
}

}
