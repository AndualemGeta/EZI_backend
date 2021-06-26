import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripListComponent } from 'src/app/features/trip-list/trip-list.component';

const routes: Routes = [
    {
        path: '',
        component: TripListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TripListRoutingModule { }