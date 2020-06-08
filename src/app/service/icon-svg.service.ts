import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class IconSvgService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  loadIcons(){
    arrSvg.forEach(key => {
      this.matIconRegistry.addSvgIcon(key.iconKeys, this.domSanitizer.bypassSecurityTrustResourceUrl(key.svgUrl));
    });
  }
}

const arrSvg = [
  { iconKeys: 'hospital-building', svgUrl: '../assets/imgs/icon/hospital-buildings.svg' },
  { iconKeys: 'worker', svgUrl: '../assets/imgs/icon/worker.svg' },
  { iconKeys: 'home', svgUrl: '../assets/imgs/icon/home.svg' },
  { iconKeys: 'ticket', svgUrl: '../assets/imgs/icon/ticket.svg' },
  { iconKeys: 'validating-ticket', svgUrl: '../assets/imgs/icon/validating-ticket.svg' },
  { iconKeys: 'best', svgUrl: '../assets/imgs/icon/best.svg' },
  { iconKeys: 'star', svgUrl: '../assets/imgs/icon/star.svg' },
  { iconKeys: 'money', svgUrl: '../assets/imgs/icon/money.svg' },
]
