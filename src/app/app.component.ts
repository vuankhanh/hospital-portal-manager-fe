import { Component } from '@angular/core';
import { TimelineOfRequestsService } from './service/timeline-of-requests.service'
import { LoginService } from './service/api/post/login.service';
import { LocalStorageService } from './service/local-storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-direct-billing-team';
  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService
  ){
    this.timelineOfRequestsService.listentWebSocket();
    let token = this.localStorageService.getLocalStorage('token');
    this.loginService.thenLogin(token);
  //   this.timelineOfRequestsService.calcCountdown('2020-01-06T11:30:41.924895+07:00').subscribe(res=>console.log(res));
  }
}
