import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "Ghion Bus", name: '12:45 pm', symbol: '25', weight: ""},
  {position: "DreamLiner Bus", name: '12:40 pm', symbol: '23', weight: ""},
  {position: "Noha Bus", name: '12:35 pm', symbol: '25', weight: ""},
  {position: "Noha Bus", name: '12:00 pm', symbol: '21', weight: ""},
  {position: "DreamLinear Bus", name: '11:45 pm', symbol: '6', weight: ""},
  {position: "Noha Bus", name: '11:30 pm', symbol: '23', weight: ""},
  
];
@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
constructor(private routeStateService: RouteStateService, private router: Router,
  private fb: FormBuilder,
  private eziService: EziBusService) { }
  form: FormGroup;
 routeState;
 now:Date;
  seatNo: any;
  AvailableSeat: any[];
  accounts: any[];
  selectedTrip: any;
  agentId: string;
  responseStyle;
  newLine: any = {};
  cities: any[];
  route:any[];
  ngOnInit(): void {
    this.routeState = this.routeStateService.getCurrent().data;
     this.now=new Date();
    this.getAllLocations();
    this.form = this.fb.group({
      departure: ['', Validators.required],
      destination: ['', Validators.required],
      tripDate: ['', Validators.required]
  });
  this.getSearchResult(this.routeState.departure,this.routeState.destination,this.routeState.tripDate);
  }

  displayedColumns: string[] = ['position', 'name', 'symbol', 'weight'];
  dataSource = ELEMENT_DATA;
    getAllLocations() {
    this.eziService.getAllLocations().then((value) => {
      this.cities = value;
    });
  }
 async getSearchResult(departure,destination,tripDate) {
    await this.eziService.searchTrip(departure,destination,tripDate).then((response) => {
      console.log(response);
      this.route = response;
    });
  }
  onSubmit(){
    let departure=this.form.controls.departure.value;
    let destination=this.form.controls.destination.value;
    let tripDate=this.form.controls.tripDate.value;
   this.getSearchResult(departure,destination,tripDate);
  }
  ReserveSeat(element){
  this.routeStateService.add(
    "user-list",
    "/reserve",
     element,
    false
  );
  }
}
