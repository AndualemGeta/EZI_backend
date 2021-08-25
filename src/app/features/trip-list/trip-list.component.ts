import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import {formatDate} from '@angular/common';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}
@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
constructor(private routeStateService: RouteStateService, private router: Router,
  private fb: FormBuilder,
  private eziService: EziBusService,
  ) { }
  selectedDeparture:any;
  selectedDestination:any;
  loading:boolean;
  form: FormGroup;
  searchResultmessage="No Trip Found, Please select another date";
  routeState;
  now:Date=new Date();
  seatNo: any;
  AvailableSeat: any[];
  accounts: any[];
  selectedTrip: any;
  agentId: string;
  responseStyle;
  newLine: any = {};
  cities: any[];
  route:any=[];
  ngOnInit(): void {
    this.loading=false;
    this.routeState = this.routeStateService.getCurrent().data;
    this.getAllLocations();
    this.selectedDeparture =this.routeState.departure ? this.routeState.departure:"ba8fcf90-31de-420f-68ac-08d8a643ea62";
    this.selectedDestination =this.routeState.destination ? this.routeState.destination:"8343ac1f-915c-452f-b93e-dd98cd7ca8f9";
    this.now=this.routeState.tripDate;
     this.form = this.fb.group({
      departure: ['', Validators.required],
      destination: ['', Validators.required],
      tripDate: ['', Validators.required]
  });
  this.loading=true;
  this.getSearchResult(this.routeState.departure,this.routeState.destination,this.routeState.tripDate);
  }
    getAllLocations() {
    this.eziService.getAllLocations().then((value) => {
      this.cities = value;
    });
  }
 async getSearchResult(departure,destination,tripDate) {
    await this.eziService.searchAllTrip(departure,destination,tripDate).then((response) => {
      this.route = response;
       if(this.route.length==0){
        this.searchResultmessage="No Trip Found, Please select another date";   
       }
       this.loading=false;
    },(error) => {
      this.searchResultmessage="No Trip Found, Please select another date";
      this.loading=false;
    });
  }
  onSubmit(){
    this.loading=true;
    let departure=this.form.controls.departure.value;
    let destination=this.form.controls.destination.value;
    let tripDate=this.form.controls.tripDate.value;
    let tDate=formatDate(tripDate,'yyyy-MM-dd', 'en-US');
    let today=formatDate(new Date(),'yyyy-MM-dd', 'en-US');
    if(departure==""||destination==""){
      this.route=[];
      this.searchResultmessage="Please select Departure and Destination";
      this.loading=false;
    }
    else if (today>tDate) {
       this.route=[];
       this.searchResultmessage="Please select future Date";
       this.loading=false;
    }
    
    else{
   this.getSearchResult(departure,destination,tripDate);
  }
}
ReserveSeat(element){
  this.routeStateService.add(
    "user-list",
    "/seat-list",
     element,
    false
  );
  }
 

  ExchangeTrip(){
    let departure =this.selectedDeparture;
    this.selectedDeparture=this.selectedDestination;
    this.selectedDestination=departure;
   }
}
