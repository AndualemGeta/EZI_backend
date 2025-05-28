import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { customDateFormat } from 'src/app/utils/date-utils';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  filteredCities: any[] = [];
  form: FormGroup;
  isHeading = true;
  isSubheading = true;
  isHeadingBtn = true;
  currentMonthIndex: number = 0;
  routeState:any;
  loading:boolean=false;
  selectedDeparture: any;
  selectedDestination: any;
  seatNo: any;
  AvailableSeat: any[] = [];
  accounts: any[] = [];
  selectedTrip: any;
  agentId: string;
  responseStyle:any;
  newLine: any = {};
  cities: any[] = [];
  now:Date=new Date();
  myControl = new FormControl();
  rotationAngle = 0;
  departureName: string = '';
  destinationName: string = '';
  dropdownVisible = { departure: false, destination: false, date: false };
  selectedDate: Date | null = null;
  months: { startDate: Date; weeks: Date[][] }[] = [];
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  availableDates: Date[] = [];

  constructor(
    private routeStateService: RouteStateService,
    private fb: FormBuilder,
    private eziService: EziBusService,
     private translate: TranslateService,
   
  ) {}

  ngOnInit() {
    this.loading=false;
     this.generateMonths();
    this.getAllLocations();
    this.getAllBankAccounts();
   
    this.selectedDeparture ="acd5118e-c32a-422b-5618-08dc2f3fba36";
    this.selectedDestination ="f28dd0f3-9d56-40d3-8aa2-bab909217887";
    this.selectedDate = this.getMidnightDate(new Date());
    
    this.form = this.fb.group({
      departure: [this.selectedDeparture, Validators.required],
      destination: [this.selectedDestination, Validators.required],
      tripDate: [this.selectedDate, Validators.required],
    }); 
    document.addEventListener('click', this.documentClickHandler.bind(this));

    this.filteredCities = [...this.cities];
    if (this.selectedDate) {
      this.updateTripDate(this.selectedDate);
    }

  this.departureName = this.getCityNameById(this.selectedDeparture);
  this.destinationName = this.getCityNameById(this.selectedDestination);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.documentClickHandler);
  }


  get formattedDate(): Date {
    return new Date(this.selectedDate);
  }

  set formattedDate(value: Date) {
    this.selectedDate = new Date(value);
  }
  documentClickHandler(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isClickOutsideDropdown =
      !target.closest('.dropdown-menu') && 
      !target.closest('#departureInput') && 
      !target.closest('#destinationInput') && 
      !target.closest('#dateInput');
  
    if (isClickOutsideDropdown) {
      this.dropdownVisible.departure = false;
      this.dropdownVisible.destination = false;
      this.dropdownVisible.date = false;
    }
  }
  getMidnightDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

 generateMonths() {
    const today = new Date();
    for (let i = 0; i < 13; i++) {
      const monthStartDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthEndDate = new Date(today.getFullYear(), today.getMonth() + i + 1, 0);
      const calendarStartDate = new Date(monthStartDate);
      calendarStartDate.setDate(calendarStartDate.getDate() - calendarStartDate.getDay() + 1);
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
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = this.months.length - 1;
    } else if (this.currentMonthIndex >= this.months.length) {
      this.currentMonthIndex = 0;
    }
  }

   filterCities(searchText: string, type: 'departure' | 'destination') {
    if (!searchText) {
      this.filteredCities = [...this.cities]; // Show all cities if no input
    } else {
      this.filteredCities = this.cities.filter(city =>
        city.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  
    this.dropdownVisible[type] = true; // Ensure dropdown stays open
  }


   updateTripDate(date: Date): void {
    this.selectedDate = this.getMidnightDate(date);
  }
  getAllLocations() {
    this.eziService.getAllLocations().then(value => {
    
      this.cities = value;
       this.filteredCities = [...this.cities]; 
    });
  }

 

 
  getAllBankAccounts() {
    this.eziService.getOperatorAccounts().then(response => {
      this.accounts = response;
    });
  }

  ExchangeTrip() {
    const icon = document.querySelector('.exchange-icon') as HTMLElement;
    if (icon) {
      this.rotationAngle += 180;
      icon.style.transform = `rotate(${this.rotationAngle}deg)`;
    }
    const temp = this.selectedDeparture;
    this.selectedDeparture = this.selectedDestination;
    this.selectedDestination = temp;
    this.updateDeparture(this.selectedDeparture);
    this.updateDestination(this.selectedDestination);
 if (this.form) {
    this.form.patchValue({
      departure: this.selectedDeparture,
      destination: this.selectedDestination
    });
  }

  }

  toggleDropdown(type: 'departure' | 'destination' | 'date'): void {
    this.dropdownVisible[type] = !this.dropdownVisible[type];

  }

  selectTown(type: 'departure' | 'destination' | 'date', town: string): void {
    if (type === 'departure') {
     this.updateDeparture(town);
      this.dropdownVisible[type] = false;
    } else {
       this.updateDestination(town);
      this.dropdownVisible[type] = false;

    }
    this.dropdownVisible[type] = false;
   // this.form.controls[type].setValue(town);
    
  }
 
  selectDate(date: Date) {
    this.selectedDate = this.getMidnightDate(date);
    this.toggleDropdown('date');
  }

  searchResult() {
    const searchData = {
      departure: this.selectedDeparture,
      destination:this.selectedDestination,
      tripDate: this.selectedDate 
  ? customDateFormat(this.selectedDate) 
  : customDateFormat(new Date()),
    };
    this.routeStateService.add(
      "user-list",
      "/trip-list",
      searchData,
      false
    );
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    return date < today; // Disable past dates
  } 


  updateDeparture(newValue: string): void {
    this.selectedDeparture = newValue;
    this.departureName = this.getCityNameById(this.selectedDeparture);
  }

  updateDestination(newValue: string): void {
    this.selectedDestination = newValue;
    this.destinationName = this.getCityNameById(this.selectedDestination);
  }

  getCityNameById(cityId: string): string {
    if (!cityId || !this.cities || this.cities.length === 0) return '';
    const city = this.cities.find(c => c.locationId === cityId);
    return this.translate.instant(city.name) || '';
    }

   
}





