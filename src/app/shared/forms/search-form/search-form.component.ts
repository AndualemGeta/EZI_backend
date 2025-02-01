import { Component,Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { customDateFormat } from 'src/app/utils/date-utils';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})

export class SearchFormComponent implements OnInit, OnDestroy {
  @Input() departureinput: string = 'acd5118e-c32a-422b-5618-08dc2f3fba36';
  @Input() destinationinput: string = 'f28dd0f3-9d56-40d3-8aa2-bab909217887';
  @Input() tripDateinput: Date = new Date();
  @Input() loading: boolean = false;
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() departureinputChange = new EventEmitter<string>();
  @Output() destinationinputChange = new EventEmitter<string>();
  @Output() tripDateinputChange = new EventEmitter<Date>();

  updateDeparture(newValue: string): void {
    this.selectedDeparture = newValue;
    this.departureinput = newValue;
    this.departureinputChange.emit(newValue);
  }

  updateDestination(newValue: string): void {
    this.selectedDestination = newValue;
    this.destinationinput = newValue;
    this.destinationinputChange.emit(newValue);
  }

  updateTripDate(date: Date): void {
    this.selectedDate = this.getMidnightDate(date);
    this.tripDateinput = this.getMidnightDate(date);
    this.tripDateinputChange.emit(this.getMidnightDate(date));
  }
  @Output() searchFunction = new EventEmitter<void>();

  onSearch(): void { 
    this.loadingChange.emit(this.loading);
    this.searchFunction.emit();
  }

  filteredCities: any[] = [];
  departureSearch: string = '';
  destinationSearch: string = '';
  form: FormGroup;
  selectedDeparture: any;
  selectedDestination: any;
  selectedDate: Date | null = null;
  isHeading = true;
  isSubheading = true;
  isHeadingBtn = true;
  currentMonthIndex: number = 0;
  routeState: any;
  seatNo: any;
  AvailableSeat: any[] = [];
  accounts: any[] = [];
  selectedTrip: any;
  agentId: string;
  responseStyle: any;
  newLine: any = {};
  cities: any[] = [];
  now: Date = new Date();
  rotationAngle = 0;
  dropdownVisible = { departure: false, destination: false, date: false };
  months: { startDate: Date; weeks: Date[][] }[] = [];
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  availableDates: Date[] = [];
  constructor(
    private fb: FormBuilder,
    private eziService: EziBusService,
  ) {}

  ngOnInit() {
    this.loading=false;
    this.selectedDeparture = this.departureinput;
    this.selectedDestination = this.destinationinput;
    this.selectedDate = this.tripDateinput;
    this.form = this.fb.group({
      departure: [this.selectedDeparture, Validators.required],
      destination: [this.selectedDestination, Validators.required],
      tripDate: [this.selectedDate, Validators.required],
    });

    this.getAllLocations();
    this.getAllBankAccounts();
    this.generateMonths();
    document.addEventListener('click', this.documentClickHandler.bind(this));
    this.filteredCities = [...this.cities];
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.documentClickHandler);
  }

  documentClickHandler(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the click is outside of the dropdowns
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

  getAllLocations() {
    this.eziService.getAllLocations().then(value => {
      this.cities = value;
      this.filteredCities = [...this.cities]; // Initialize filtered list
    }).catch(error => {
      console.error('Error fetching locations:', error);
    });
  }
  

  getCityNameById(cityId: string): string {
    const city = this.cities.find(c => c.locationId === cityId);
    return city ? city.name : '';
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
  }

  toggleDropdown(type: 'departure' | 'destination' | 'date'): void {
    console.log("toggleDropdown",this.dropdownVisible[type]);
    this.filteredCities = [...this.cities];
    // this.dropdownVisible[type] = !this.dropdownVisible[type];
    this.dropdownVisible[type] = true; 
    // console.log("toggleDropdown",this.dropdownVisible[type]);
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
  
  
  

  getMidnightDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }



  selectDate(date: Date) {
    this.updateTripDate(date);
    this.toggleDropdown('date');
  }

}
