import { Component, OnInit } from '@angular/core';
import { RouteStateService } from 'src/app/Service/route-state.service';
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  constructor(private routeStateService: RouteStateService) { }

  ngOnInit(): void {
  }

   gotoHome(){
    this.routeStateService.add(
    "user-list",
    "/",
     {},
    false
  );
}


}
