import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { slideInAnimation } from '../../animations/usually-use';

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
    private router: Router,
    private authenticationService: AuthenticationService,
    private listTicketsService: ListTicketsService
  ) {
    this.initSideMenu();
  }

  ngOnInit() {
    this.listTicketsService.listenTicketsOpen.subscribe(res=>console.log(res));
    this.listTicketsService.listenDirectBillingTaken
    // this.listTicketsService.listenListTicket.subscribe(tickets=>{
    //   if(tickets){
    //     let opdProcessingBadge: number = tickets.filter(ticket=> ticket.insmart_status === 'TAKEN').length;
    //     this.opdProcessingBadge$.next(opdProcessingBadge);

    //     let opdRequestBadge: number = tickets.filter(ticket=> ticket.costs.length === 0 && ticket.insmart_status === 'OPEN').length;
    //     this.opdRequestBadge$.next(opdRequestBadge);

    //     let opdRequestForRefundBadge: number = tickets.filter(ticket=> ticket.costs.length > 0 && ticket.insmart_status === 'OPEN').length;
    //     this.opdRequestForRefundBadge$.next(opdRequestForRefundBadge);

    //   }
    // })
  }

  initSideMenu(){
    this.sideMenus = [
      { id: 0, routerLink:'/dashboard/directbilling', name:'Bảo Lãnh', badge$: this.listTicketsService.listenDirectBillingTaken },
      { id: 1, routerLink:'/dashboard/pending' , name:'Đang Chờ', badge$: this.listTicketsService.listenTicketsOpen }
    ]
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
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
