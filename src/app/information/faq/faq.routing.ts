import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from 'src/app/information/faq/faq.component';

const routes: Routes = [
    {
        path: '',
        component: FaqComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FaqRoutingModule { }