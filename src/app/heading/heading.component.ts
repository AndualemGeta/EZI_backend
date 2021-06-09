import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {

  isHeading = true;
  isSubheading = true;
  isHeadingBtn = true;
now=new Date();
  constructor() { }

  ngOnInit() {
  }

}
