import { TestBed } from '@angular/core/testing';

import { PassengerTicketPrintService } from './passenger-ticket-print.service';

describe('PassengerTicketPrintService', () => {
  let service: PassengerTicketPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassengerTicketPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
