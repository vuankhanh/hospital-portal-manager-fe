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
    let token = this.localStorageService.getLocalStorage('token');
    this.loginService.thenLogin(token).then(data=>{
      console.log(data);
      let datas: any = data;
      if(datas[1].code === 200 && datas[1].message==='OK'){
        this.listTicketsService.getAll(datas[1].data);
      }
    }).catch(err=>{
      this.router.navigate(['/login']);
      console.log(err);
    });
  }
}
