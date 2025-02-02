import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { PassengerTicketPrintService } from 'src/app/Service/passenger-ticket-print.service';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { TicketPrintService } from 'src/app/Service/ticket-print.service';

@Component({
  selector: 'app-reservation-result',
  templateUrl: './reservation-result.component.html',
  styleUrls: ['./reservation-result.component.css']
})
export class ReservationResultComponent implements OnInit {

  routeState;
  reservation;	
 constructor(private routeStateService: RouteStateService, private router: Router,
  private eziService: EziBusService,
  private printService: TicketPrintService,
 
  ) { }

  ngOnInit(): void {
    this.routeState = this.routeStateService.getCurrent().data;
    this.reservation=this.routeState;
    console.log(this.reservation);
  }

  getStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Confirmed',
      2: 'Pending',
      3: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats to readable date-time
  }
  printData() {
    this.printService.generatePassengerTicketPDF(this.reservation);
  }
}
