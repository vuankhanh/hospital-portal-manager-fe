import { Component } from '@angular/core';
import { TimelineOfRequestsService } from './service/timeline-of-requests.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-direct-billing-team';
  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService
  ){
    this.timelineOfRequestsService.listentWebSocket();

  //   this.timelineOfRequestsService.calcCountdown('2020-01-06T11:30:41.924895+07:00').subscribe(res=>console.log(res));
  }
}
