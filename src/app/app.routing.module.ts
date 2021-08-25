import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
const appRoutes: Routes = [
  
  {
    path: "home",
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
    path: "termsof-service",
    loadChildren: () =>
      import("src/app/information/terms/terms.module").then((m) => m.TermsModule),
  },
    {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  
  imports: [RouterModule.forRoot(appRoutes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
  
})
export class AppRoutingModule {}
