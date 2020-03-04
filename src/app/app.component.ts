import { Component, OnInit } from '@angular/core';

import { TitleService } from './service/title.service';
import { TimelineOfRequestsService } from './service/timeline-of-requests.service'
import { LoginService } from './service/api/post/login.service';
import { LocalStorageService } from './service/local-storage.service';
import { ListTicketsService } from './service/list-tickets.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-direct-billing-team';
  constructor(
    private titleSerive: TitleService,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private listTicketsService: ListTicketsService,
    private router: Router
  ){
    this.timelineOfRequestsService.listentWebSocket();
  }

  ngOnInit(){
    let userData = this.localStorageService.getLocalStorage('token');
    if(userData && userData.token){
      this.loginService.thenLogin(userData.token, userData.data.id).then(data=>{
        console.log(data);
        let datas: any = data;
        if(datas[1].code === 200 && datas[1].message==='OK'){
          this.listTicketsService.getDirectBillingTaken(datas[1]);
        }
        if(datas[2].code === 200 && datas[2].message==='OK'){
          this.listTicketsService.getTicketsOpen(datas[2]);
        }
      }).catch(err=>{
        this.router.navigate(['/login']);
        console.log(err);
      });
    }
  }
}
