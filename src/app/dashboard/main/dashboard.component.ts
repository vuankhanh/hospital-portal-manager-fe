import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { slideInAnimation } from '../../animations/usually-use';

import { TabPageService } from 'src/app/service/tab-page.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations:[ slideInAnimation ]
})
export class DashboardComponent implements OnInit {
  sideMenus: Array<SideMenu>;

  countPending: number;
  constructor(
    private router: Router,
    public tabPageService: TabPageService
  ) {
    this.initSideMenu();
  }

  ngOnInit() {
    this.tabPageService.getBadgeDirectBilling().subscribe(res=>console.log(res));
  }

  initSideMenu(){
    this.sideMenus = [
      { id: 0, routerLink:'/dashboard/directbilling', name:'Bảo Lãnh', badge$: this.tabPageService.getBadgeDirectBilling() },
      { id: 1, routerLink:'/dashboard/therequirements' , name:'Không tìm thấy tự động', badge$: this.tabPageService.getBadgeRefundRequestPending()  },
      { id: 2, routerLink:'/dashboard/requestarefund', name:'Yêu cầu Hoàn trả' },
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
