import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { slideInAnimation } from '../../animations/usually-use';
import { MatDialog } from '@angular/material';

import { PushSmsComponent } from '../../sharing/modal/push-sms/push-sms.component';

import { AuthenticationService } from '../../service/authentication.service';
import { ListTicketsService } from '../../service/list-tickets.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations:[ slideInAnimation ]
})
export class DashboardComponent implements OnInit {
  sideMenus: Array<SideMenu>;

  opdTakenBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdTakenBadge: Observable<number> = this.opdTakenBadge$.asObservable();

  opdOpenBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdOpenBadge: Observable<number> = this.opdOpenBadge$.asObservable();

  constructor(
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private listTicketsService: ListTicketsService
  ) {
    this.initSideMenu();
  }

  ngOnInit() {}

  initSideMenu(){
    this.sideMenus = [
      { id: 0, routerLink:'/dashboard/directbilling', name:'Bảo Lãnh', badge$: this.listTicketsService.listenDirectBillingTaken },
      { id: 1, routerLink:'/dashboard/pending' , name:'Đang Chờ', badge$: this.listTicketsService.listenTicketsOpen }
    ]
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  testSms(){
    this.dialog.open(PushSmsComponent);
  }

  btnAvatarSetting(){
    console.log("Avatar's Setting");
  }

  logout(){
    console.log('Logout');
    this.authenticationService.logout();
  }
}
export interface SideMenu{
  id: number;
  routerLink:string;
  name:string;
  badge$?: Observable<number>
}
