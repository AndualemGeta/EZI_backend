import { Component, OnInit,HostListener } from '@angular/core';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { customDateFormat } from 'src/app/utils/date-utils';
@Component({
  selector: 'app-travel-information',
  templateUrl: './travel-information.component.html',
  styleUrls: ['./travel-information.component.css']
})

export class TravelInformationComponent implements OnInit {
  destinations: any[] = [];
  availableRoutes: any[] = [];
  currentPage = 1;
  totalPages = 0;
  constructor(private eziService: EziBusService,private routeStateService: RouteStateService) {}
  ngOnInit() {
    this.getAvailableRoutes();
  }

  getAvailableRoutes() {
    this.eziService.getAvailableRoutes().then((data) => {
      this.availableRoutes = data;
      this.totalPages = Math.ceil(this.availableRoutes.length / 1); // Assuming 1 route per display area
    });
  }

  scroll(direction: number): void {
    const container = document.querySelector('.routes-container') as HTMLElement;
    if (container) {
      const scrollAmount = direction === 1 ? container.clientWidth : -container.clientWidth; // Positive for right, negative for left
      const newScrollLeft = Math.max(0, Math.min(container.scrollLeft + scrollAmount, container.scrollWidth - container.clientWidth));
  
      console.log(`Current Scroll: ${container.scrollLeft}, New Scroll: ${newScrollLeft}`); // Debugging line
  
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  
      // Update currentPage based on direction
      if (direction === 1) {
        this.currentPage = Math.min(this.totalPages, this.currentPage + 1); // Next page
      } else {
        this.currentPage = Math.max(1, this.currentPage - 1); // Previous page
      }
    } else {
      console.error('Container not found'); // Debugging line
    }
  }

  getCardColor(index: number): string {
    const colors = ['#2980b9', '#1c2833', '#e67e22'];
    return colors[index % colors.length];
  }

  bookRoute(route: any): void {
    const searchData = {
      departure: route.departureLocationId,
      destination:route.arrivalLocationId,
      tripDate:  customDateFormat(new Date()),
    };
    this.routeStateService.add(
      "user-list",
      "/trip-list",
      searchData,
      false
    );
  }
}







