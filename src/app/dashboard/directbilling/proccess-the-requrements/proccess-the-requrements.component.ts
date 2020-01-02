import { Component, OnInit } from '@angular/core';

import { DirectBillingService } from '../../../service/direct-billing.service';
import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { HospitalCheckService } from '../../../service/hospital-check.service';
@Component({
  selector: 'app-proccess-the-requrements',
  templateUrl: './proccess-the-requrements.component.html',
  styleUrls: ['./proccess-the-requrements.component.scss']
})
export class ProccessTheRequrementsComponent implements OnInit {
  countDownTimer: Timer;
  constructor(
    public directBillingService: DirectBillingService,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private hospitalCheckService: HospitalCheckService
  ) {
    this.countDownTime();
  }

  ngOnInit() {
    
  }

  countDownTime(){
    this.timelineOfRequestsService.listenCountdown$.subscribe(timer=>{
      this.countDownTimer = timer;
    });
  }

  confirm(){
    this.hospitalCheckService.getHospitalConfirm().subscribe(response=>console.log(response));
  }

  reject(){
    this.hospitalCheckService.getHospitalReject().subscribe(response=>console.log(response));
  }
}
