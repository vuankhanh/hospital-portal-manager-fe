import { Directive, ElementRef, OnInit, HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective implements OnInit {
  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit(){
    this.el.value = this.currencyPipe.transform(this.el.value, 'VND');
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.currencyPipe.transform(value, 'VND'); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.currencyPipe.transform(value, 'VND');
  }
}
