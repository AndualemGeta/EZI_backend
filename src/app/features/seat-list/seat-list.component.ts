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
  title = "seat-chart-generator";
  reserveRegisterForm: FormGroup;
  disableReservebutton: boolean;
  loading: boolean;
  paymentMethod : string="TeleBirr";
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
      tickets: new FormArray([]),
      accountId: ['', []],
      paymentMethod : ['TeleBirr', Validators.required],
      seatNumber:[this.cart.selectedSeats]
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
      if(this.cart.selectedSeats.length>=5){
        alert("You Can not reserve more than 5 seats");
        return false;
            }
      seatObject.status = "booked";
      this.cart.selectedSeats.push(seatObject.seatNo);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
      this.AddNUmberOfPassengers(this.cart.selectedSeats.length);
      } else if ((seatObject.status = "booked")) {
      seatObject.status = "available";
      var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatNo);
      if (seatIndex > -1) {
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



// convenience getters for easy access to form fields
get f() { return this.dynamicForm.controls; }
get t() { return this.f.tickets as FormArray; }

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
  console.log(this.dynamicForm.value);
  // stop here if form is invalid
  if (this.dynamicForm.invalid) { 
    alert("Please fill all passenger information first");
    return;
  }
// display form values on success
  alert('SUCCESS!!!\n\n' + JSON.stringify(this.dynamicForm.value, null, 4));
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
      this.paymentMethod == 'BankTransfer';
    }
    else{
      this.paymentMethod == 'TeleBirr';
    }
  }
  
}

