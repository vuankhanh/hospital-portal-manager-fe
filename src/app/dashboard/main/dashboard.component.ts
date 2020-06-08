import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { slideInAnimation } from '../../animations/usually-use';
import { MatDialog } from '@angular/material';
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';

import { PushSmsComponent } from '../../sharing/modal/push-sms/push-sms.component';

import { AuthenticationService } from '../../service/authentication.service';
import { ListTicketsService } from '../../service/list-tickets.service';

import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations:[ slideInAnimation ]
})
export class DashboardComponent implements OnInit {

  userInformation:any;
  
  sideMenus: Array<SideMenu>;

  opdTakenBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdTakenBadge: Observable<number> = this.opdTakenBadge$.asObservable();

  opdOpenBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdOpenBadge: Observable<number> = this.opdOpenBadge$.asObservable();

  showFiller = false;
  constructor(
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private listTicketsService: ListTicketsService
  ) {
    this.initSideMenu();
  }

  ngOnInit() {
    this.listenUserInformation();
  }

  listenUserInformation(){
    this.authenticationService.listenUserInformation.subscribe(result=>{
      this.userInformation = result.data;
    })
  }

  initSideMenu(){
    this.sideMenus = [
      { id: 0, routerLink:'/dashboard/home', icon: { type: 'customize', name: 'home' }, name:'Trang chủ', badge$: this.listTicketsService.listenDirectBillingTaken },
      { id: 1, routerLink:'/dashboard/staff-account-management', icon: { type: 'customize', name: 'worker' }, name:'Quản lý tài khoản nhân viên', badge$: this.listTicketsService.listenDirectBillingTaken },
      { id: 2, routerLink:'/dashboard/hospital-list-management', icon: { type: 'customize', name: 'hospital-building' }, name:'Quản lý danh sách CSYT', badge$: this.listTicketsService.listenDirectBillingTaken },
      { id: 3, routerLink:'/dashboard/out-working-time', icon: { type: 'default', name: 'timer_off' }, name:'Trực ngoài giờ', badge$: this.listTicketsService.listenDirectBillingTaken },
      { id: 4, routerLink:'/dashboard/export-data', icon: { type: 'default', name: 'cloud_download' }, name:'Xuất dữ liệu', badge$: this.listTicketsService.listenDirectBillingTaken }
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
    this.authenticationService.logout();
  }
}
export interface SideMenu{
  id: number;
  routerLink: string;
  icon: {
    type: string;
    name: string;
  };
  name: string;
  badge$?: Observable<number>
}
