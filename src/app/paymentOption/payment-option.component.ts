import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
export class PaymentOptionComponent implements OnInit {
  
 constructor(){}

 ngOnInit(){

 	jQuery(function($){

 			let owl = $('.owl-carousel');

		 	owl.owlCarousel({
		    margin:10,
		    touchDrag:true,
		    responsive:{
		        0:{
		            items:1
		        },
		        600:{
		            items:3
		        },
		        1000:{
		            items:5
		        }
		    }
		});

		$('.customNextBtn').click(function() {
		    owl.trigger('next.owl.carousel');
		});

		$('.customPrevBtn').click(function() {
		    owl.trigger('prev.owl.carousel');
		});

	});

  }


}
