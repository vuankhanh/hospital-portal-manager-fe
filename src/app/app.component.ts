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
  }
}
