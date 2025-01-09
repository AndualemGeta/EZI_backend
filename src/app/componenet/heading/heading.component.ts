import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})

export class HeadingComponent implements OnInit {
  form: FormGroup;
  isHeading = true;
  isSubheading = true;
  isHeadingBtn = true;
   now=new Date();
  constructor(private routeStateService: RouteStateService, private router: Router,
    private fb: FormBuilder,
    private eziService: EziBusService) { }
  routeState;
  selectedDeparture:any;
  selectedDestination:any;
  seatNo: any;
  AvailableSeat: any[];
  accounts: any[];
  selectedTrip: any;
  agentId: string;
  responseStyle;
  newLine: any = {};
  cities: any[];
  myControl = new FormControl();
  rotationAngle = 0;

  isModalOpen = false;
  
  towns: string[] = ['Springfield', 'Gotham', 'Metropolis', 'Smallville'];
  dropdownVisible = { departure: false, destination: false };
 
  ngOnInit() {
   this.selectedDeparture ="ba8fcf90-31de-420f-68ac-08d8a643ea62";
   this.selectedDestination ="8343ac1f-915c-452f-b93e-dd98cd7ca8f9";
   this.form = this.fb.group({
      departure: [this.selectedDeparture, Validators.required],
      destination: [this.selectedDestination, Validators.required],
      tripDate: ['', Validators.required],
       });
    this.getAllLocations();
    this.getAllBankAccounts();
  }
 
  
  selectCity(city) {
    this.selectedDeparture = city;
    this.isModalOpen = false;
    
  }


searchResult(){
  let searchData={
    destination:this.form.controls.destination.value,
    departure:this.form.controls.departure.value,
    tripDate:this.form.controls.tripDate.value
  };
 
  this.routeStateService.add(
    "user-list",
    "/trip-list",
    searchData,
    false
  );
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

ExchangeTrip(){
  const icon = document.querySelector('.exchange-icon') as HTMLElement;
    if (icon) {
      this.rotationAngle += 180;
      // icon.classList.toggle('rotate');
      icon.style.transform = `rotate(${this.rotationAngle}deg)`;
    }
   let departure =this.selectedDeparture;
   this.selectedDeparture=this.selectedDestination;
   this.selectedDestination=departure;
  }
onSubmit(){
  this.form.controls.destination.value;
  this.form.controls.departure.value;
  this.form.controls.tripDate.value;
}

toggleDropdown(type: 'departure' | 'destination'): void {
  this.dropdownVisible[type] = !this.dropdownVisible[type];
}

selectTown(type: 'departure' | 'destination', town: string): void {
  if (type === 'departure') {
    this.selectedDeparture = town;
  } else {
    this.selectedDestination = town;
  }
  this.dropdownVisible[type] = false;
}
}




