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
@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
constructor(private routeStateService: RouteStateService, private router: Router,
  private fb: FormBuilder,
  private eziService: EziBusService) { }
  loading:boolean;
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
  route:any=[];
  ngOnInit(): void {
    this.loading=false;
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
    getAllLocations() {
    this.eziService.getAllLocations().then((value) => {
      this.cities = value;
    });
  }
 async getSearchResult(departure,destination,tripDate) {
    await this.eziService.searchTrip(departure,destination,tripDate).then((response) => {
       this.route = response;
       this.loading=false;
    },(error) => {
      this.loading=false;
    });
  }
  onSubmit(){
    this.loading=true;
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
