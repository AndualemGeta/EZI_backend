import { PaymentPhoneRoutingModule } from 'src/app/features/payment-phone/payment-phone.routing';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
const appRoutes: Routes = [
  {
    path: "book-bus-tickets-in-ethiopia",
    loadChildren: () =>
      import("src/app/componenet/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "reserve",
    loadChildren: () =>
      import("src/app/features/reserve-trip/reserve-trip.module").then((m) => m.ReserveTripdModule),
  },
  {
    path: "seat-list",
    loadChildren: () =>
      import("src/app/features/seat-list/seat-list.routing").then((m) => m.SeatListRoutingModule),
  },
  
  {
    path: "trip-list",
    loadChildren: () =>
      import("src/app/features/trip-list/trip-list.module").then((m) => m.TripListModule),
  },
  {
    path: "procced-to-payment",
    loadChildren: () =>
      import("src/app/features/payment-phone/payment-phone.module").then((m) => m.PaymentPhoneModule),
  },

  {
    path: "payment-instructions",
    loadChildren: () =>
      import("src/app/payment-responses/success-page/success-page.component").then((m) => m.SuccessPageComponent),
  },
  {
    path: "book-result",
    loadChildren: () =>
      import("src/app/features/reservation-result/reservation-result.module").then((m) => m.ReservationResultModule),
  },
  {
    path: "ezibus/termsof-service",
    loadChildren: () =>
      import("src/app/information/terms/terms.module").then((m) => m.TermsModule),
  },
  {
    path: "ezibus/how-to-buy-bus-ticket-online",
    loadChildren: () =>
      import("src/app/information/how-to-book/how-to-book.module").then((m) => m.HowToBookModule),
  },
  {
    path: "ezibus/frequently-asked-questions",
    loadChildren: () =>
      import("src/app/information/faq/faq.module").then((m) => m.FaqModule),
  },
  {
    path: "home",
    redirectTo: "book-bus-tickets-in-ethiopia",
    pathMatch: "full",
  },
    {
    path: "",
    redirectTo: "book-bus-tickets-in-ethiopia",
    pathMatch: "full",
  },
  {
    path : "print-ticket/:billCode",
    loadChildren : () => import("src/app/features/print-ticket/print-ticket.module").then((m) => m.PrintTicketModule )
  }
];

@NgModule({
  
  imports: [RouterModule.forRoot(appRoutes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
  
})
export class AppRoutingModule {}
