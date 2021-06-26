import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[about]'
})

export class AboutDirective {
 
  constructor(private el: ElementRef) { }
 
  @Input() defaultColor: string="#000";
 
  @Input('about') about: string="bout";
 
  @HostListener('mouseenter') onMouseEnter() {
    this.setHoverEffect();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeHoverEffect();
  }
 
  private setHoverEffect() {
    this.el.nativeElement.classList.add('about-hover-effect');
  }

  private removeHoverEffect() {
    this.el.nativeElement.classList.remove('about-hover-effect');
  }

}