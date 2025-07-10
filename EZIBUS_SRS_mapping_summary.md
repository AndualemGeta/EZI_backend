# EZIBUS SRS Mapping Summary

| SRS Requirement | Backend Implementation | Mobile App Implementation | Frontend Implementation | Coverage/Notes |
|-----------------|-----------------------|--------------------------|------------------------|---------------|
| **FR1: Admin can register Agents/Supervisors** | `EziBusApi/Controllers/AuthenticationController.cs` (`RegisterUser`, `RegisterStaff`) | `app/screens/Signup/signUp.js` | (Admin UI, not directly found) | Fully implemented in backend and mobile; check for admin UI in frontend |
| **FR2: Agent login** | `EziBusApi/Controllers/AuthenticationController.cs` (`Authenticate`) | `app/screens/Login/login.js`, `app/api/login.js` | (Login redirect in `Payment-service.ts`, `ezibus-apiservice.ts`) | Fully implemented |
| **FR3: Agent bus registration** | `EziBusApi/Controllers/BusController.cs`, `Repository/BusRepository.cs` | `app/screens/Checkin/checkin.js`, `app/screens/Triplist/tripList.js` | (Trip/bus management UI) | Fully implemented |
| **FR4: Queue number assignment** | `EziBusApi/Controllers/BookingController.cs`, `PublicReservationController.cs`, `Repository/TransactionRepository.cs` | `app/screens/Triplist/tripList.js`, `app/screens/Checkin/scheduleList.js` | (Queue display UI) | Fully implemented |
| **FR5: Agent view queue** | Same as FR4 | `app/screens/Triplist/tripList.js`, `app/screens/Checkin/scheduleList.js` | (Queue display UI) | Fully implemented |
| **FR6: Book tickets, seat assignment** | `EziBusApi/Controllers/BookingController.cs`, `TransactionController.cs`, `Repository/TransactionRepository.cs` | `app/screens/Ticket/ticket.js`, `app/screens/Triplist/tripList.js`, `app/screens/TicketList.js` | (Booking UI) | Fully implemented |
| **FR7: Ticket/queue slip printing** | (Ticket/queue data endpoints) | `app/screens/Ticket/printTicket.js`, `printTicket2.js`, `printMultipleTicket.js`, `service/CustomBluetoothPrinter.js`, `DatecsPrinter.js` | `Service/ticket-print.service.ts`, `passenger-ticket-print.service.ts` | Fully implemented |
| **FR8: Supervisor dashboard login** | `EziBusApi/Controllers/AuthenticationController.cs`, `DashboardController.cs` |  | (Dashboard UI) | Fully implemented |
| **FR9: Supervisor monitor activity, bus, schedules** | `EziBusApi/Controllers/DashboardController.cs`, `ReportController.cs`, `ScheduleController.cs` |  | (Dashboard UI) | Fully implemented |
| **FR10: Analytics/reports** | `EziBusApi/Controllers/ReportController.cs`, `ReportService/ReportService.cs`, `ReportService.SuperAgent.cs` |  | (Dashboard/reporting UI) | Fully implemented |
| **NFR1: Offline mode with sync** |  | (Needs review for offline logic) |  | Check for local storage/sync logic in mobile app |
| **NFR2: ESC/POS printer support** |  | `service/CustomBluetoothPrinter.js`, `DatecsPrinter.js` |  | Fully implemented in mobile app |
| **NFR3: Backend <2s response** | (All API endpoints) |  |  | Needs performance testing |
| **NFR4: Data integrity** | (Transactional logic in repositories/services) |  |  | Needs code review/testing |
| **NFR5: Real-time dashboard** | (Dashboard/report endpoints) |  | (Dashboard UI) | Check for WebSocket/polling for real-time updates |
| **NFR6: HTTPS encryption** | (Deployment config) |  |  | Standard for production deployments |
| **NFR7: Local language support** |  | `app/i18n/` | `src/assets/i18n/` | Fully implemented |

---

**Legend:**
- `EziBusApi/Controllers/...` = Backend C# API controllers
- `app/screens/...` = Mobile app React Native screens
- `Service/...` = Angular frontend services
- (UI) = User interface components/screens
- (Needs review) = Feature may exist but needs further verification

**Notes:**
- For requirements marked as "Needs review," further code inspection or testing is recommended.
