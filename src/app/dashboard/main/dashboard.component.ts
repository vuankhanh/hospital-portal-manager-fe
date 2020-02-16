import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { slideInAnimation } from '../../animations/usually-use';

import { TabPageService } from 'src/app/service/tab-page.service';
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

  opdProcessingBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdProcessingBadge: Observable<number> = this.opdProcessingBadge$.asObservable();

  opdRequestBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdRequestBadge: Observable<number> = this.opdRequestBadge$.asObservable();

  opdRequestForRefundBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdRequestForRefundBadge: Observable<number> = this.opdRequestForRefundBadge$.asObservable();
  constructor(
    private router: Router,
    public tabPageService: TabPageService,
    private listTicketsService: ListTicketsService
  ) {
    this.initSideMenu();
  }

  ngOnInit() {
    this.listTicketsService.listenListTicket.subscribe(tickets=>{
      if(tickets){
        let opdProcessingBadge: number = tickets.filter(ticket=> ticket.insmart_status === 'TAKEN').length;
        this.opdProcessingBadge$.next(opdProcessingBadge);

        let opdRequestBadge: number = tickets.filter(ticket=> ticket.costs.length === 0 && ticket.insmart_status === 'OPEN').length;
        this.opdRequestBadge$.next(opdRequestBadge);

        let opdRequestForRefundBadge: number = tickets.filter(ticket=> ticket.costs.length > 0 && ticket.insmart_status === 'OPEN').length;
        this.opdRequestForRefundBadge$.next(opdRequestForRefundBadge);

      }
    })
  }

  initSideMenu(){
    this.sideMenus = [
      { id: 0, routerLink:'/dashboard/directbilling', name:'Bảo Lãnh', badge$: this.opdProcessingBadge },
      { id: 1, routerLink:'/dashboard/therequirements' , name:'Kiểm tra Quyền Lợi', badge$: this.opdRequestBadge },
      { id: 2, routerLink:'/dashboard/requestarefund', name:'Yêu cầu Hoàn trả', badge$: this.opdRequestForRefundBadge },
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
  }
}
export interface SideMenu{
  id: number;
  routerLink:string;
  name:string;
  badge$?: Observable<number>
}
