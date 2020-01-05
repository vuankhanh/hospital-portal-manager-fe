import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineOfRequestsService, Timer, RefundRequest } from '../../service/timeline-of-requests.service';
import { TabPageService } from 'src/app/service/tab-page.service';
import { TraTuService } from '../../service/tra-tu.service';
import { FakeRequestARefundService } from '../../service/fake-request-a-refund.service';
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
    private tabPageService: TabPageService,
    public traTuService: TraTuService,
    private fakeRequestARefundService: FakeRequestARefundService
  ) {
    this.refundRequests = this.fakeRequestARefundService.refundRequests;
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
    console.log(element);
    //get index of element is selected in array
    let index = this.refundRequests.map(x => x.id).indexOf(element.id);
    this.refundRequests[index].checked = true;

    this.router.navigate(['/dashboard/directbilling']).then(_=>this.tabPageService.setPageNumber(1));
  }

}
