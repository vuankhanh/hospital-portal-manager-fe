import { Component, OnInit } from '@angular/core';

import { TitleService } from './service/title.service';
import { TimelineOfRequestsService } from './service/timeline-of-requests.service'
import { LoginService } from './service/api/post/login.service';
import { LocalStorageService } from './service/local-storage.service';
import { ListTicketsService } from './service/list-tickets.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './service/authentication.service';
import { ToastService } from './service/toast.service';
import { TraTuService } from './service/tra-tu.service';
import { IconSvgService } from './service/icon-svg.service';

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
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private traTuService: TraTuService,
    private iconSvgService: IconSvgService
  ){
    this.timelineOfRequestsService.listentWebSocket();
    this.iconSvgService.loadIcons();
  }

  ngOnInit(){
    let userData = this.localStorageService.getLocalStorage('token');
    this.authenticationService.setUserInformation(userData);
    if(userData && userData.token){
      this.loginService.thenLogin(userData.token, userData.data.id).then(data=>{
        let datas: any = data;
        if(datas[0].code === 200 && datas[0].message==='OK'){
          this.traTuService.setInsurers(datas[0].insurers);
        }

        if(datas[1].code === 200 && datas[1].message==='OK'){
          this.listTicketsService.getDirectBillingTaken(datas[1]);
        }
        if(datas[2].code === 200 && datas[2].message==='OK'){
          this.listTicketsService.getTicketsOpen(datas[2]);
        }
        if(datas[3].code === 200 && datas[2].message==='OK'){
          this.listTicketsService.getTicketsHistory(datas[3]);
        }
      }).catch(err=>{
        if(err.status && err.status === 401 && err.statusText === 'Unauthorized'){
          this.toastService.showShortToast('Mời bạn đăng nhập lại', 'Hết hạn phiên đăng nhập');
        }
        this.router.navigate(['/login']).then(_=>this.localStorageService.removeLocalStorage('token'));
      });
    }
  }
  
}
