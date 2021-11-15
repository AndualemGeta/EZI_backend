import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EziBusService } from 'src/app/Service/ezibus-apiservice';
import { PassengerTicketPrintService } from 'src/app/Service/passenger-ticket-print.service';

@Component({
  selector: 'app-print-ticket',
  templateUrl: './print-ticket.component.html',
  styleUrls: ['./print-ticket.component.css']
})
export class PrintTicketComponent implements OnInit {

  constructor(private _Activatedroute:ActivatedRoute,
    private _printService : PassengerTicketPrintService,
    private eziService : EziBusService) { }
  billCode : string;
  reservation : any;
  ngOnInit(): void {
    var code =  this._Activatedroute.snapshot.paramMap.get("billCode");
    this.billCode = code;
  }

  generatePdf(){
    this.eziService.getReservationData(this.billCode).then((data) => {
      this.reservation = data;
      if(data.reservationStatus == 2){
        data.transactions.map((i) => {
          this._printService.generatePDF(i);
        })
      }
    })
  }

}
