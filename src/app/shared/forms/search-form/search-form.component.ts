import { Component,Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})

export class SearchFormComponent implements OnInit, OnDestroy {
  @Input() departureinput: string = 'select departure';
  @Input() destinationinput: string = 'select destination';
  @Input() tripDateinput: Date = new Date();
  @Input() loading: boolean = false;
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() departureinputChange = new EventEmitter<string>();
  @Output() destinationinputChange = new EventEmitter<string>();
  @Output() tripDateinputChange = new EventEmitter<Date>();

  updateDeparture(newValue: string): void {
    this.selectedDeparture = newValue;
    this.departureinput = newValue;
    this.departureName = this.getCityNameById(this.selectedDeparture);
    this.departureinputChange.emit(newValue);
  }

  updateDestination(newValue: string): void {
    this.selectedDestination = newValue;
    this.destinationinput = newValue;
  this.destinationName = this.getCityNameById(this.selectedDestination);
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
departureFilteredCities: any[] = [];
destinationFilteredCities: any[] = [];

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
  departureName = '';
 destinationName = '';
  rotationAngle = 0;
  dropdownVisible = { departure: false, destination: false, date: false };
  constructor(
    private fb: FormBuilder,
    private eziService: EziBusService,
    private translate: TranslateService,
    private _snackBar : MatSnackBar,
  ) {}

  async ngOnInit() {
    this.loading=false;
    this.selectedDeparture = this.departureinput || '';
    this.selectedDestination = this.destinationinput || '';
    this.selectedDate = this.tripDateinput || new Date();
    this.form = this.fb.group({
      departure: [this.selectedDeparture, Validators.required],
      destination: [this.selectedDestination, Validators.required],
      tripDate: [this.selectedDate, Validators.required],
    });
    await this.getAllLocations();
   
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

  async getAllLocations() {
   await this.eziService.getAllLocations().then(value => {
      this.cities = value;
      this.departureFilteredCities = [...this.cities];
      this.destinationFilteredCities = [...this.cities];
    }).catch(error => {
      console.error('Error fetching locations:', error);
    });
  }
  
  getCityNameById(cityId: string): string {
    if (!cityId || !this.cities || this.cities.length === 0) return '';
    const city = this.cities.find(c => c.locationId === cityId);
    return this.translate.instant(city.name) || '';
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
    // this.filteredCities = [...this.cities];
    this.dropdownVisible[type] = !this.dropdownVisible[type];
    // this.dropdownVisible[type] = true; 
    // console.log("toggleDropdown",this.dropdownVisible[type]);
  }

  selectTown(type: 'departure' | 'destination', town: string): void {
    if (type === 'departure') {
      this.updateDeparture(town);
      this.dropdownVisible[type] = false;
    } else {
      this.updateDestination(town);
      this.dropdownVisible[type] = false;
    }
    this.dropdownVisible[type] = false;
    
  }
  
  
  // filterCities(searchText: string, type: 'departure' | 'destination') {
  //   if (!searchText) {
  //     this.filteredCities = [...this.cities]; // Show all cities if no input
  //   } else {
  //     this.filteredCities = this.cities.filter(city =>
  //       city.name.toLowerCase().includes(searchText.toLowerCase())
  //     );
  //   }
  
  //   this.dropdownVisible[type] = true; // Ensure dropdown stays open
  // }
  
filterCities(searchText: string, type: 'departure' | 'destination') {
  const filtered = this.cities.filter(city =>
    city.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (type === 'departure') {
    this.departureFilteredCities = searchText ? filtered : [...this.cities];
  } else {
    this.destinationFilteredCities = searchText ? filtered : [...this.cities];
  }

  this.dropdownVisible[type] = true;
}



  getMidnightDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
selectDate(date: Date) {
  if (this.isPastDate(date)) {
    this._snackBar.open('You cannot select a past date', '', {
  duration: 2000,
  verticalPosition: 'top',        
  horizontalPosition: 'center',   
});
 return;
  }
  this.updateTripDate(date);
  this.dropdownVisible['date'] = false;
}


  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    return date < today; // Disable past dates
  }
  
}
