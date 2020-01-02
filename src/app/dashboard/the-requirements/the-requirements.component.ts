import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineOfRequestsService, Timer } from '../../service/timeline-of-requests.service';
import { HospitalCheckService } from '../../service/hospital-check.service';
import { WebsocketService } from '../../service/websocket.service';
import { TabPageService } from '../../service/tab-page.service';
import { DirectBillingService } from '../../service/direct-billing.service';

@Component({
  selector: 'app-the-requirements',
  templateUrl: './the-requirements.component.html',
  styleUrls: ['./the-requirements.component.scss']
})
export class TheRequirementsComponent implements OnInit {
  historyRequests: any;
  countDownTimer: Timer;
  constructor(
    private router: Router,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private hospitalCheckService: HospitalCheckService,
    private webSocketService: WebsocketService,
    private tabPageService: TabPageService,
    private directBillingService: DirectBillingService
  ) {
    this.timelineOfRequestsService.historyDirectBilling().subscribe(result=>{
      this.historyRequests = result;
    });
    this.listenSocket();
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
    this.hospitalCheckService.getHospitalCheck().subscribe(res=>{
      console.log(res);
      if(res.code === 200){
        this.router.navigate(['/dashboard/directbilling']).then(_=>this.directBillingService.setProccessRequest(element)).then(_=>this.tabPageService.setPageNumber(0));
      }
    });
    // let index = this.refundRequests.map(x => x.id).indexOf(element.id);
    // this.refundRequests[index].checked = true;
    // this.directBillingService.setProccessDirectBilling(element);

    
  }

  listenSocket(){
    this.webSocketService.listenWebSocket().subscribe(res=>{
      let response = JSON.parse(res);
      console.log(response);
      if(response.data){
        this.historyRequests.push(this.historyRequests.filter(historyRequest=>historyRequest.id===4)[0]);
      }
    })
  }
}
