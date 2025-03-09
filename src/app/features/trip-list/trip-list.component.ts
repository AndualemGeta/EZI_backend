import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import {formatDate} from '@angular/common';
import { customDateFormat } from 'src/app/utils/date-utils';

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
constructor(private routeStateService: RouteStateService, private router: Router, private activatedRoute: ActivatedRoute,
  private cdr: ChangeDetectorRef,
  private eziService: EziBusService,
  ) { }
  selectedDeparture:any;
  selectedDestination:any;
  loading:boolean;
  // form: FormGroup;
  searchResultmessage="No Trip Found,on this date Please select another date";
  routeState;
  selectedDate:Date=new Date();
  seatNo: any;
  AvailableSeat: any[];
  accounts: any[];
  selectedTrip: any;
  agentId: string;
  responseStyle;
  newLine: any = {};
  cities: any[];
  route:any=[];
  now: Date = new Date();
  
  async ngOnInit(): Promise<void> {
    this.loading=true;
    this.activatedRoute.params.subscribe(async (params) => {
    this.routeState = this.routeStateService.getCurrent().data || {};
    this.selectedDeparture =this.routeState?.departure || "ba8fcf90-31de-420f-68ac-08d8a643ea62";
    this.selectedDestination =this.routeState?.destination || "8343ac1f-915c-452f-b93e-dd98cd7ca8f9";
    this.selectedDate=this.routeState?.tripDate || new Date();
    await this.getAllLocations();
    await this.getSearchResult(this.selectedDeparture,this.selectedDestination, this.routeState?.tripDate);
  });
  
  
  }
  
  async ngAfterViewInit(){
    await this.getAllLocations();
  }
  async getAllLocations() {
    try {
      const value = await this.eziService.getAllLocations();
      this.cities = value || []; 
    } catch (error) {
      console.error('Error fetching cities:', error);
      this.cities = []; // Handle the error by ensuring cities is an array
    }
  }
  
  

  get formattedDate(): Date {
    return new Date(this.selectedDate);
  }

  set formattedDate(value: Date) {
    this.selectedDate = new Date(value);
  }

  async getSearchResult(departure,destination,tripDate) {
  if(departure==""||destination==""){
    this.route=[];
    this.searchResultmessage="Please select Departure and Destination";
    this.cdr.detectChanges();
    return;
  }
  else if (this.compareDates(new Date(tripDate))) {
    this.route=[];
    this.searchResultmessage="Please select a future date";
    this.cdr.detectChanges();
    return;
  }
  this.loading=true;
 this.eziService.searchAllTrip(departure,destination,tripDate).then((response) => {
    this.route = response;
       if(this.route.length==0){
        this.searchResultmessage="No Trip Found, Please select another date";
       }
     this.loading=false;
    },(error) => {
      this.searchResultmessage="some thing went wrong Please try again";
      this.loading=false;
    });
 }

searchtrip(): void {
  let tripDate=customDateFormat(new Date(this.selectedDate));
  this.getSearchResult(this.selectedDeparture,this.selectedDestination,tripDate);
}

ReserveSeat(element){
  this.routeStateService.add(
    "user-list",
    "/seat-list",
     element,
    false
  );
  }

compareDates(tripDate: Date): boolean {
    let tripDay = formatDate(tripDate, 'yyyy-MM-dd', 'en-US');
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    return today > tripDay;
}
}

function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

