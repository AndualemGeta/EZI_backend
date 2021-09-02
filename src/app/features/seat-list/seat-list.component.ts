import {Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
@Component({
  selector: 'app-seat-list',
  templateUrl: './seat-list.component.html',
  styleUrls: ['./seat-list.component.css']
})
export class SeatListComponent  {
   seatConfig: any = null;
   submitted:boolean;
   seatmap = [];
   seatChartConfig = {
    showRowsLabel: false,
    showRowWisePricing: false,
    newSeatNoForRow: false
  };
  
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
  title = "seat-chart-generator";
  reserveRegisterForm: FormGroup;
  disableReservebutton: boolean;
  loading: boolean;
  paymentMethod : string;
  constructor(private routeStateService: RouteStateService, private router: Router,
    private _formBuilder: FormBuilder,
    private eziService: EziBusService,
    ) { }
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    dynamicForm: FormGroup;
  ngOnInit(): void {
    this.dynamicForm  =this._formBuilder.group({
      numberOfTickets: ['1', Validators.required],
      tickets: new FormArray([]),
      accountId: ['', []],
      paymentMethod : ['', Validators.required]
  });
    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });
    //Process a simple bus layout
    // this.reserveRegisterForm = this._formBuilder.group({
    //   name: ['', Validators.required],
    //   phone: ['', [Validators.required, Validators.required]],
    //   discount: [0, Validators.required],
    //   laggage: [0, Validators.required],
    //   seatNum: ['', Validators.required],
    //   accountId: ['', []],
    //   paymentMethod : ['', Validators.required]
    // });

    this.display = false;
    this.getAllLocations();
    this.getAllBankAccounts();
    this.agentId = 'DE937EB1-F20A-44E5-451C-08D8A705F255';
    // var bankControl = this.reserveRegisterForm.get('accountId');
    // this.reserveRegisterForm.get('paymentMethod').valueChanges.subscribe((value) => {
    //   if(value == 'BankTransfer')
    //   {
    //      bankControl.setValidators([Validators.required]);
    //   }
    //   else{
    //     bankControl.setValidators(null);
    //   }
    // })
    this.routeState = this.routeStateService.getCurrent().data;
    this.selectedTrip=this.routeState;
    this.seatConfig = [
      {
        seat_price:this.selectedTrip.price,
        seat_map: [
          {
            seat_label: "1",
            layout: "g____gg"
          },
          {
            seat_label: "2",
            layout: "ggg__gg"
          },
          {
            seat_label: "3",
            layout: "ggg__gg"
          },
          {
            seat_label: "4",
            layout: "ggg__gg"
          },
          {
            seat_label: "5",
            layout: "ggg__gg"
          },
          {
            seat_label: "6",
            layout: "ggg__gg"
          },
          {
            seat_label: "7",
            layout: "ggg__gg"
          },
          {
            seat_label: "8",
            layout: "ggg__gg"
          },
          {
            seat_label: "9",
            layout: "ggg__gg"
          },
          {
            seat_label: "10",
            layout: "ggg__gg"
          },
          {
            seat_label: "11",
            layout: "ggggggg"
          }
        ]
      }
    ];

    this.processSeatChart(this.seatConfig);
    this.blockSeats("8_1,7_2,");
  }

  public processSeatChart(map_data: any[]) {
    if (map_data.length > 0) {
      var seatNoCounter = 1;
      for (let __counter = 0; __counter < map_data.length; __counter++) {
        var row_label = "";
        var item_map = map_data[__counter].seat_map;

        //Get the label name and price
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
            }
            totalItemCounter++;
            mapObj["seats"].push(seatObj);
          });
          console.log(" \n\n\n Seat Objects ", mapObj);
          this.seatmap.push(mapObj);
        });
      }
    }
  }
 
  public selectSeat(seatObject: any) {
    
    if (seatObject.status == "available") {
      seatObject.status = "booked";
      this.cart.selectedSeats.push(seatObject.seatLabel);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
      this.AddNUmberOfPassengers(this.cart.selectedSeats.length);
      
    } else if ((seatObject.status = "booked")) {
      seatObject.status = "available";
      var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatLabel);
      if (seatIndex > -1) {
        this.cart.selectedSeats.splice(seatIndex, 1);
        this.cart.seatstoStore.splice(seatIndex, 1);
        this.cart.totalamount -= seatObject.price;
      }
      this.AddNUmberOfPassengers(this.cart.selectedSeats.length);
      
    }
  }

  public blockSeats(seatsToBlock: string) {
    if (seatsToBlock != "") {
      var seatsToBlockArr = seatsToBlock.split(",");
      for (let index = 0; index < seatsToBlockArr.length; index++) {
        var seat = seatsToBlockArr[index] + "";
        var seatSplitArr = seat.split("_");
        console.log("Split seat: ", seatSplitArr);
        for (let index2 = 0; index2 < this.seatmap.length; index2++) {
          const element = this.seatmap[index2];
          if (element.seatRowLabel == seatSplitArr[0]) {
            var seatObj = element.seats[parseInt(seatSplitArr[1]) - 1];
            if (seatObj) {
              console.log("\n\n\nFount Seat to block: ", seatObj);
              seatObj["status"] = "unavailable";
              this.seatmap[index2]["seats"][
                parseInt(seatSplitArr[1]) - 1
              ] = seatObj;
              console.log("\n\n\nSeat Obj", seatObj);
              console.log(
                this.seatmap[index2]["seats"][parseInt(seatSplitArr[1]) - 1]
              );
              break;
            }
          }
        }
      }
    }
  }



// convenience getters for easy access to form fields
get f() { return this.dynamicForm.controls; }
get t() { return this.f.tickets as FormArray; }

onChangeTickets(e) {
  const numberOfTickets = e.target.value || 0;
  if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
          this.t.push(this._formBuilder.group({
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
AddNUmberOfPassengers(e) {
  const numberOfTickets = e || 0;
  if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
          this.t.push(this._formBuilder.group({
              name: ['', Validators.required],
              email: ['', [Validators.required, Validators.email]],
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
console.log(this.dynamicForm.value);
  // stop here if form is invalid
  if (this.dynamicForm.invalid) {
    console.log("Problems");  
    return;
  }

  // display form values on success
  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.dynamicForm.value, null, 4));
}
  onReset() {
    // reset whole form back to initial state
    //this.submitted = false;
    this.dynamicForm.reset();
    this.t.clear();
  }
  
  onClear() {
    // clear errors and reset ticket fields
    //this.submitted = false;
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
    console.log(Value)
    if(Value=="bank"){
      this.paymentMethod == 'BankTransfer';
    }
    else{
      this.paymentMethod == '';
    }
  }
  
}

