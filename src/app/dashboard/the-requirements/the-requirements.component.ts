import { Component, OnInit } from '@angular/core';

import { TimelineOfRequestsService, Timer } from '../../service/timeline-of-requests.service';

@Component({
  selector: 'app-the-requirements',
  templateUrl: './the-requirements.component.html',
  styleUrls: ['./the-requirements.component.scss']
})
export class TheRequirementsComponent implements OnInit {
  historyRequests: any;
  countDownTimer: Timer;
  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService
  ) {
    this.timelineOfRequestsService.historyDirectBilling().subscribe(result=>{
      this.historyRequests = result;
    });

    this.countDownTime();
  }

  ngOnInit() {

  }

  countDownTime(){
    this.timelineOfRequestsService.listenCountdown$.subscribe(timer=>{
      this.countDownTimer = timer;
    });
  }

  startProccess(element){
    //get index of element is selected in array

    console.log(element);
    // let index = this.refundRequests.map(x => x.id).indexOf(element.id);
    // this.refundRequests[index].checked = true;
    // this.directBillingService.setProccessDirectBilling(element);

    // this.router.navigate(['/dashboard/directbilling']).then(_=>this.tabPageService.setPageNumber(1));
  }

}
