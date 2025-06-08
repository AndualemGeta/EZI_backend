import { ActivatedRoute } from '@angular/router';
import { Component, OnInit,ChangeDetectionStrategy,ElementRef, Renderer2  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { customDateFormat } from 'src/app/utils/date-utils';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {
  filteredDepartureCities: any[] = [];
  filteredDestinationCities: any[] = [];
  form: FormGroup;
  routeState:any;
  loading:boolean=false;
  page_loading:boolean=true;
  selectedDeparture: any="select departure";
  selectedDestination: any="select destination";
  selectedDate: Date = new Date();
  minDate: Date = this.getMidnightDate(new Date());
  cities: any[] = [];
  now:Date=new Date();
  myControl = new FormControl();
  rotationAngle = 0;
  departureName: string = '';
  destinationName: string = '';
  dropdownVisible = { departure: false, destination: false, date: false };

private routeSub: Subscription;
  constructor(
    private routeStateService: RouteStateService,
    private fb: FormBuilder,
    private eziService: EziBusService,
    private translate: TranslateService,
    private _snackBar : MatSnackBar,
    private el: ElementRef,
    private renderer: Renderer2,private route: ActivatedRoute
   
  ) {
     this.form = this.fb.group({
      departure: [this.selectedDeparture],
      destination: [this.selectedDestination],
      tripDate: [this.selectedDate],
    }); 
  }

ngOnInit() {
  this.routeSub = this.route.queryParams.subscribe(params => {
      this.initializeHomePage(); 
    });
    
  document.addEventListener('click', this.documentClickHandler.bind(this));
}

  initializeHomePage() {
    this.page_loading = true;
    Promise.all([
    this.eziService.getAllLocations(),
  ]).then(([locations]) => {
    this.cities = locations;
    this.filteredDepartureCities = [...this.cities];
    this.filteredDestinationCities = [...this.cities];
  if (this.cities.length >= 2) {
      this.selectedDeparture = this.cities[0].locationId;
      this.selectedDestination = this.cities[1].locationId;
    }
   this.page_loading = false;
     this.form.patchValue({
        departure: this.selectedDeparture,
        destination: this.selectedDestination,
        tripDate: this.selectedDate,
      });
    this.filteredDepartureCities = [...this.cities];
    this.filteredDestinationCities = [...this.cities];
    this.departureName = this.getCityNameById(this.selectedDeparture);
  this.destinationName = this.getCityNameById(this.selectedDestination);
  }).catch(() => {
    this._snackBar.open('Failed to load data', '', { duration: 2000 });
    this.page_loading = false;
  });
  }

ngAfterViewInit(): void {
  const heading = this.el.nativeElement.querySelector('#heading');
  if (heading) {
    setTimeout(() => {
      this.renderer.addClass(heading, 'lazy-loaded');
    }, 0);
  }
}

  ngOnDestroy() {
    document.removeEventListener('click', this.documentClickHandler);
 if (this.routeSub) {
      this.routeSub.unsubscribe(); // Clean up subscription
    }
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
 
   filterCities(searchText: string, type: 'departure' | 'destination') {
    if (type === 'departure') {
    this.filteredDepartureCities = !searchText
      ? [...this.cities]
      : this.cities.filter(city =>
          city.name.toLowerCase().includes(searchText.toLowerCase())
        );
  } else {
    this.filteredDestinationCities = !searchText
      ? [...this.cities]
      : this.cities.filter(city =>
          city.name.toLowerCase().includes(searchText.toLowerCase())
        );
  }
    this.dropdownVisible[type] = true; // Ensure dropdown stays open
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
  

  async searchResult() {
  this.loading=true;
   if (this.selectedDeparture=="select departure" || this.selectedDestination=="select destination") {
    const message = 'Please select both departure and destination locations.';
    this._snackBar.open(message, '',
      {duration: 2000, verticalPosition: 'top',        
  horizontalPosition: 'center'});
    this.loading=false;
    return;
  }
  const tripDateValue = this.form.get('tripDate').value;
  console.log('Selected Trip Date:', tripDateValue);
  const searchData = {
      departure: this.selectedDeparture,
      destination:this.selectedDestination,
      tripDate: customDateFormat(tripDateValue) 
    };

     this.routeStateService.add(
      "user-list",
      "/trip-list",
      searchData,
      false
    );
   this.loading=false;
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

  formatDateToMMMdy(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}



  getMidnightDate(date: Date): Date {
    const midnightDate = new Date(date);
    midnightDate.setHours(0, 0, 0, 0); // Set to midnight
    return midnightDate;
  }
}