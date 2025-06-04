import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { RouteStateService } from 'src/app/Service/route-state.service';
import { TicketPrintService } from 'src/app/Service/ticket-print.service';
import html2canvas from 'html2canvas';
import etDate from "../../../assets/js/getEthiopianDate.js";



@Component({
  selector: 'app-reservation-result',
  templateUrl: './reservation-result.component.html',
  styleUrls: ['./reservation-result.component.css']
})
export class ReservationResultComponent implements OnInit {
  @ViewChild('contentToDownload', { static: false }) content!: ElementRef;

  routeState: any;
  reservation: any;
  qrData: string = '';

  constructor(
    private routeStateService: RouteStateService,
    private router: Router,
    private eziService: EziBusService,
    private printService: TicketPrintService
  ) {}

  ngOnInit(): void {
    this.routeState = this.routeStateService.getCurrent().data;
    this.reservation = this.routeState;
    this.qrData = JSON.stringify({
      passenger: this.reservation.transactions[0].passenger.fullName,
      phone: this.reservation.transactions[0].passenger.phoneNumber,
      tripDate: this.reservation.transactions[0].schedule.tripDate.split("T")[0],
      trip: `${this.reservation.transactions[0].schedule.departureLocation} - ${this.reservation.transactions[0].schedule.arrivalLocation}`,
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
    return date.toLocaleString();
  }

  printData() {
    this.printService.generatePassengerTicketPDF(this.reservation);
  }

  convertDat(date: any) {
    return etDate(new Date(date));
  }

  gotoHome() {
    this.routeStateService.add("user-list", "/", {}, false);
  }

async saveToGallery(): Promise<void> {
    if (!this.content || !this.content.nativeElement) {
      console.error('Content element not found.');
      alert('Cannot capture content: The ticket details are not fully loaded.');
      return;
    }
    const buttons = document.querySelector('.button-group');
    if (buttons) {
      (buttons as HTMLElement).style.display = 'none';
    }
    const header = document.querySelector('app-header');
    if(header) {
      (header as HTMLElement).style.display = 'none';
    }
    
    try {
      const canvas = await html2canvas(this.content.nativeElement, {
        scale: window.devicePixelRatio * 2, 
        useCORS: true,
        allowTaint: true, 
        logging: true, 
      });

      // Re-show hidden elements after canvas capture
      if (buttons) {
        (buttons as HTMLElement).style.display = 'block';
      }
      if(header) {
        (header as HTMLElement).style.display = 'block';
      }

      // Create a link element to trigger the download
      const imageDataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = `EZIBUS_Ticket_${this.reservation.billCode}.png`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Ticket downloaded! Please check your phone');
    } catch (error) {
      alert('Failed to download ticket. Please take screen shoot.');
    } finally {
        // Ensure buttons are visible even if an error occurs
        if (buttons) {
            (buttons as HTMLElement).style.display = 'block';
        }
        if(header) {
          (header as HTMLElement).style.display = 'block';
        }
    }
  }
}



