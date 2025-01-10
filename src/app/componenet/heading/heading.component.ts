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
   currentMonthIndex: number = 0;
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
  dropdownVisible = { departure: false, destination: false, date: false };
  selectedDate: Date | null = null;
  months: { startDate: Date; weeks: Date[][] }[] = [];
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  availableDates: Date[] = [];
  ngOnInit() {
  //  this.selectedDeparture ="acd5118e-c32a-422b-5618-08dc2f3fba36";
  //  this.selectedDestination ="f28dd0f3-9d56-40d3-8aa2-bab909217887";
   this.form = this.fb.group({
      departure: [this.selectedDeparture, Validators.required],
      destination: [this.selectedDestination, Validators.required],
      tripDate: ['', Validators.required],
       });
    this.getAllLocations();
    this.getAllBankAccounts();
    this.generateMonths();

    
  }
 
  generateMonths() {
    const today = new Date();
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 13; i++) {
      const monthStartDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthEndDate = new Date(today.getFullYear(), today.getMonth() + i + 1, 0);
  
      // Start of the calendar view (from the Monday before the 1st)
      const calendarStartDate = new Date(monthStartDate);
      calendarStartDate.setDate(calendarStartDate.getDate() - calendarStartDate.getDay() + 1);
  
      // End of the calendar view (to the Sunday after the last day)
      const calendarEndDate = new Date(monthEndDate);
      calendarEndDate.setDate(calendarEndDate.getDate() + (7 - calendarEndDate.getDay()));
  
      const weeks: Date[][] = [];
      let currentWeek: Date[] = [];
  
      for (let d = new Date(calendarStartDate); d <= calendarEndDate; d.setDate(d.getDate() + 1)) {
        currentWeek.push(new Date(d));
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }
  
      this.months.push({ startDate: monthStartDate, weeks });
    }
  }
  
  navigateMonth(direction: number): void {
    this.currentMonthIndex += direction; 
    // Ensure the index stays within bounds
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = this.months.length - 1; // Wrap to the last month
    } else if (this.currentMonthIndex >= this.months.length) {
      this.currentMonthIndex = 0; // Wrap to the first month
    }
  }
  getCityNameById(cityId: string): string {
    const city = this.cities.find(c => c.locationId === cityId);
    return city ? city.name : '';
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
      icon.style.transform = `rotate(${this.rotationAngle}deg)`;
    }
   const temp = this.selectedDeparture;
    this.selectedDeparture = this.selectedDestination;
    this.selectedDestination = temp;
    this.form.controls.departure.setValue(this.selectedDeparture);
    this.form.controls.destination.setValue(this.selectedDestination);
  }

  toggleDropdown(type: 'departure' | 'destination' | 'date'): void {
  this.dropdownVisible[type] = !this.dropdownVisible[type];
}

selectTown(type: 'departure' | 'destination'| 'date', town: string): void {
  if (type === 'departure') {
    this.selectedDeparture = town;
  } else {
    this.selectedDestination = town;
  }
  this.dropdownVisible[type] = false;
  this.form.controls[type].setValue(town);
}

selectDate(date: Date) {
  this.selectedDate = date;
  this.form.controls.tripDate.setValue(date.toISOString().split('T')[0]); // Set value in ISO format
  this.toggleDropdown('date');
}

searchResult(){
  const searchData = {
    destination: this.form.controls.destination.value,
    departure: this.form.controls.departure.value,
    tripDate: this.form.controls.tripDate.value,
  };
  this.routeStateService.add(
    "user-list",
    "/trip-list",
    searchData,
    false
  );
 }


}




