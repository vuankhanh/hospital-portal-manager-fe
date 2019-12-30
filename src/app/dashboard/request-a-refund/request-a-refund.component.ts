import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineOfRequestsService, Timer, RefundRequest } from '../../service/timeline-of-requests.service';
import { DirectBillingService } from '../../service/direct-billing.service';
import { TabPageService } from 'src/app/service/tab-page.service';
@Component({
  selector: 'app-request-a-refund',
  templateUrl: './request-a-refund.component.html',
  styleUrls: ['./request-a-refund.component.scss']
})
export class RequestARefundComponent implements OnInit {
  refundRequests: any;
  countDownTimer: Timer;
  displayedColumns: string[] = ['category', 'money', 'note'];
  constructor(
    private router: Router,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private directBillingService: DirectBillingService,
    private tabPageService: TabPageService
  ) {
    this.timelineOfRequestsService.historyDirectBilling().subscribe(refundRequests=>{
      this.refundRequests = refundRequests;
      console.log(this.refundRequests);
    });

    this.countDownTime();
  }

  ngOnInit() {}

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

  edit(element){
    console.log(element);
  }

  startProccess(element){
    //get index of element is selected in array
    let index = this.refundRequests.map(x => x.id).indexOf(element.id);
    this.refundRequests[index].checked = true;
    this.directBillingService.setProccessDirectBilling(element);

    this.router.navigate(['/dashboard/directbilling']).then(_=>this.tabPageService.setPageNumber(1));
  }

}
