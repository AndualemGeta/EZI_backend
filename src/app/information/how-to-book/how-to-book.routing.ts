import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HowToBookComponent } from 'src/app/information/how-to-book/how-to-book.component';

const routes: Routes = [
    {
        path: '',
        component: HowToBookComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HowToBookRoutingModule { }