import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  seatNo: any;
  AvailableSeat: any[];
  accounts: any[];
  selectedTrip: any;
  agentId: string;
  responseStyle;
  newLine: any = {};
  cities: any[];

  ngOnInit() {
    this.form = this.fb.group({
      departure: ['', Validators.required],
      destination: ['', Validators.required],
      tripDate: ['', Validators.required]
  });
    this.getAllLocations();
    this.getAllBankAccounts();
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

onSubmit(){
  this.form.controls.destination.value;
  this.form.controls.departure.value;
  this.form.controls.tripDate.value;
}

}
