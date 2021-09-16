import { Component, OnInit } from '@angular/core';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';

export interface Specification {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-travel-information',
  templateUrl: './travel-information.component.html',
  styleUrls: ['./travel-information.component.css']
})
export class TravelInformationComponent implements OnInit {

  isHeading = true;

  displayedColumns: string[] = ['item', 'cost'];

  specifications: Specification[] = [
    {item: 'Addis Ababa', cost: 150},
    {item: 'Adama', cost: 130},
    {item: 'Bahir Dar', cost: 200},
    {item: 'DireDawa', cost: 300},
    {item: 'Jigijiga', cost: 250},
    {item: 'Hawassa', cost: 135},
    {item: 'Mekele', cost: 205},
  ];
  destinations : any[];
  constructor(private eziSerice : EziBusService) { }

  getTotalCost() {
    return this.specifications.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  ngOnInit() {
    this.getActiveDestinations();
  }

  getActiveDestinations(){
    this.eziSerice.getDestinations().then((data) => {
      this.destinations = data;
      const locationNames = [...new Set(data.map(item => item.name))];
      this.destinations = locationNames;
    })
  }

}
