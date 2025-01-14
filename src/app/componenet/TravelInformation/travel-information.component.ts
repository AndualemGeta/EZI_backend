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
  availableRoutes:any;
  constructor(private eziService : EziBusService) { }

  getTotalCost() {
    return this.specifications.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  ngOnInit() {
    this.getActiveDestinations();
    this.getAvailableRoutes();
  }

  getActiveDestinations(){
    this.eziService.getDestinations().then((data) => {
      this.destinations = data;
      console.log(data);
      const locationNames = [...new Set(data.map(item => item.name))];
      this.destinations = locationNames;
    })
  }
  getAvailableRoutes(){
    this.eziService.getAvailableRoutes().then((data) => {
      this.availableRoutes = data;
      console.log(data);
    })
  }
  
  chunkRoutes(routes: any[], size: number): any[][] {
    const chunks = [];
    for (let i = 0; i < routes.length; i += size) {
      chunks.push(routes.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Gets the number of carousel indicators based on the number of chunks.
   */
  getCarouselIndicators(): number[] {
    const chunks = this.chunkRoutes(this.availableRoutes, 4);
    return new Array(chunks.length - 1);
  }
  bookRoute(route: any): void {
    console.log('Selected Route:', route);
    // Add logic to handle booking
  }
  
}
