import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import {formatDate} from '@angular/common';
import { customDateFormat } from 'src/app/utils/date-utils';
import { EthiopianDateService } from 'src/app/Service/ethiopian-date.service';
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
  public etDate: EthiopianDateService
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
    this.selectedDeparture =this.routeState?.departure || "select departure";
    this.selectedDestination =this.routeState?.destination || "select destination";
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
  
  set formattedDate(value: Date) {
    this.selectedDate = new Date(value);
  }

  async getSearchResult(departure,destination,tripDate) {
  if(departure==""||destination==""){
    this.route=[];
    this.searchResultmessage = "Please select both a departure and destination location.";
    this.cdr.detectChanges();
    return;
  }
  else if (this.compareDates(new Date(tripDate))) {
    this.route=[];
   this.searchResultmessage = "Please choose a valid future date for your trip.";
    this.cdr.detectChanges();
    return;
  }
  this.loading=true;
 this.eziService.searchAllTrip(departure,destination,tripDate).then((response) => {
    this.route = response;
  
       if(this.route.length==0){
        this.searchResultmessage = "No trips available for the selected date. Please try a different date.";
       }
     this.loading=false;
    },(error) => {
      this.searchResultmessage = "Something went wrong while searching. Please try again later.";
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

