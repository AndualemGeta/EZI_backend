import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { PassengerTicketPrintService } from 'src/app/Service/passenger-ticket-print.service';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { TicketPrintService } from 'src/app/Service/ticket-print.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reservation-result',
  templateUrl: './reservation-result.component.html',
  styleUrls: ['./reservation-result.component.css']
})
export class ReservationResultComponent implements OnInit {
@ViewChild('contentToDownload', { static: false }) content!: ElementRef;
  routeState;
  reservation;	
  qrData: string = '';
 constructor(private routeStateService: RouteStateService, private router: Router,
  private eziService: EziBusService,
  private printService: TicketPrintService,
 
  ) { }

  ngOnInit(): void {
    this.routeState = this.routeStateService.getCurrent().data;
    this.reservation=this.routeState;
    this.qrData= JSON.stringify({
  passenger: this.reservation.transactions[0].passenger.fullName,
  phone: this.reservation.transactions[0].passenger.phoneNumber,
  tripDate: this.reservation.transactions[0].schedule.tripDate.split("T")[0],
  trip:`${this.reservation.transactions[0].schedule.departureLocation} -${this.reservation.transactions[0].schedule.arrivalLocation}`,
});
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

 downloadAsImage(): void {
  html2canvas(this.content.nativeElement).then((canvas) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
    const link = document.createElement('a');
    link.download = `ezibus-${randomNum}.png`; // Set the image name
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}


}
