import { Component, OnInit } from '@angular/core';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { DirectBillingService } from 'src/app/service/direct-billing.service';
import { TabPageService } from 'src/app/service/tab-page.service';
@Component({
  selector: 'app-proccess-the-refund-request',
  templateUrl: './proccess-the-refund-request.component.html',
  styleUrls: ['./proccess-the-refund-request.component.scss']
})
export class ProccessTheRefundRequestComponent implements OnInit {
  countDownTimer: Timer;
  displayedColumns: string[] = ['category', 'money', 'note'];

  displayedColumnsFix: string[] = ['money', 'note'];
  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService,
    public directBillingService : DirectBillingService,
    private tabPageService: TabPageService
  ) { }

  ngOnInit() {
    this.countDownTime();
  }

  countDownTime(){
    this.timelineOfRequestsService.listenCountdown$.subscribe(timer=>{
      this.countDownTimer = timer;
    });
  }

  countTotal(arrayNumber:any){
    
    let total = 0;
    arrayNumber.forEach(element=>{
      total += parseInt(element.value);
    });
    return total;
  }
}
