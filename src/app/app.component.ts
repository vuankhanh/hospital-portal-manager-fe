import { Component, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { TitleService } from './service/title.service';
import { LoginService } from './service/api/post/login.service';
import { LocalStorageService } from './service/local-storage.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './service/authentication.service';
import { ToastService } from './service/toast.service';
import { TraTuService } from './service/tra-tu.service';
import { ListenConfigurationService } from './service/listen-configuration.service';
import { IconSvgService } from './service/icon-svg.service';
import { BackEndService } from './service/api/get/back-end';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'angular-direct-billing-team';

  public onlineEvent: Observable<Event>;
  public offlineEvent: Observable<Event>;
  public subscriptions: Subscription[] = [];
  public connectionStatusMessage: string;

  public connectionStatus: string;
  constructor(
    private titleSerive: TitleService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private traTuService: TraTuService,
    private listenConfigurationService: ListenConfigurationService,
    private iconSvgService: IconSvgService,
    private backEndService: BackEndService
  ){
    this.iconSvgService.loadIcons();
  }

  ngOnInit(){
    
    let userData = this.localStorageService.getLocalStorage('token');

    this.authenticationService.setUserInformation(userData);
    if(userData && userData.token){
      this.loginService.thenLogin(userData.token).then(data=>{
        let datas: any = data;

        if(datas[0] && datas[0].code ===200){
          this.listenConfigurationService.setCity(datas[0].data.city);
        }
      }).catch(err=>{
        if(err.status && err.status === 401 && err.statusText === 'Unauthorized'){
          this.toastService.showShortToast('Mời bạn đăng nhập lại', 'Hết hạn phiên đăng nhập');
        }
        this.router.navigate(['/login']).then(_=>this.localStorageService.removeLocalStorage('token'));
      });
    }

    this.listenConnectionStatus();
  }

  listenConnectionStatus(){
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.subscriptions.push(this.onlineEvent.subscribe(event => {
        this.connectionStatusMessage = 'Connected to internet! You are online';
        this.connectionStatus = 'online';
        console.log('Đang có mạng');
    }));
    this.subscriptions.push(this.offlineEvent.subscribe(e => {
        this.connectionStatusMessage = 'Connection lost! You are offline';
        this.connectionStatus = 'offline';
        console.log('Mất mạng');
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  
}
