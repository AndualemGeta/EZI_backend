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
  currentMonthIndex: number = 0;
  routeState:any;
  loading:boolean=false;
  page_loading:boolean=true;
  selectedDeparture: any="select departure";
  selectedDestination: any="select destination";
  selectedDate: Date= this.getMidnightDate(new Date());

  cities: any[] = [];
  now:Date=new Date();
  myControl = new FormControl();
  rotationAngle = 0;
  tripdateName:any;
  departureName: string = '';
  destinationName: string = '';
  dropdownVisible = { departure: false, destination: false, date: false };
  
  months: { startDate: Date; weeks: Date[][] }[] = [];
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  availableDates: Date[] = [];
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
    this.generateMonths();
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
     if (this.selectedDate) {
      this.updateTripDate(this.selectedDate);
       }
  this.departureName = this.getCityNameById(this.selectedDeparture);
  this.destinationName = this.getCityNameById(this.selectedDestination);
  this.tripdateName= this.formatDateToMMMdy(this.selectedDate);
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
  getMidnightDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  generateMonths() {
    this.months = [];
    const today = new Date();
    for (let i = 0; i < 2; i++) {
      const monthStartDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      this.months.push({
        startDate: monthStartDate,
        weeks: this.generateWeeksForMonth(monthStartDate)
      });
    }
  }
  generateWeeksForMonth(monthStartDate: Date): Date[][] {
    const monthEndDate = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0);
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
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    return weeks;
  }

  navigateMonth(direction: number): void {
    this.currentMonthIndex += direction;
    if (this.currentMonthIndex >= this.months.length) {
      const nextMonth = new Date(this.months[this.months.length - 1].startDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.months.push({
        startDate: nextMonth,
        weeks: this.generateWeeksForMonth(nextMonth)
      });
    }
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 0;
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

updateTripDate(date: Date): void {
    this.selectedDate = this.getMidnightDate(date);
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
    this.tripdateName= this.formatDateToMMMdy(this.selectedDate);
    this.toggleDropdown('date');
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
  const searchData = {
      departure: this.selectedDeparture,
      destination:this.selectedDestination,
      tripDate: customDateFormat(this.selectedDate) 
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

onDateClick(date: Date) {
  if (this.isPastDate(date)) {
    this._snackBar.open('You cannot select a past date', '', {
  duration: 2000,
  verticalPosition: 'top',        
  horizontalPosition: 'center',   
});

    return;
  }
  this.selectDate(date);
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
}