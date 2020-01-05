import { Component, OnInit } from '@angular/core';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { HospitalCheckService } from '../../../service/hospital-check.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { DirectbillingTheRequirementService } from '../../../service/directbilling-the-requirement.service';
import { TraTuService } from '../../../service/tra-tu.service';

@Component({
  selector: 'app-proccess-the-requrements',
  templateUrl: './proccess-the-requrements.component.html',
  styleUrls: ['./proccess-the-requrements.component.scss']
})
export class ProccessTheRequrementsComponent implements OnInit {
  countDownTimer: Timer;
  processCase:any = [];
  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService,
    private hospitalCheckService: HospitalCheckService,
    private localStorageService: LocalStorageService,
    private directbillingTheRequirementService: DirectbillingTheRequirementService,
    public traTuService: TraTuService
  ) {
    this.countDownTime();
  }

  ngOnInit() {
    this.directbillingTheRequirementService.listenDbTheRequestments.subscribe(res=>{
      console.log(res);
      
      this.processCase = res;
    })
  }

  countDownTime(){
    this.timelineOfRequestsService.listenCountdown$.subscribe(timer=>{
      this.countDownTimer = timer;
    });
  }

  confirm(element){
    console.log(element.id);
    let token = this.localStorageService.getLocal('token');
    this.hospitalCheckService.getHospitalConfirm(element.id, token).subscribe(response=>{
      console.log(response);
      this.directbillingTheRequirementService.removeTheRequestments(element);
    });
  }

  reject(element){
    console.log(element.id);
    let token = this.localStorageService.getLocal('token');
    this.hospitalCheckService.getHospitalReject(element.id, token).subscribe(response=>{
      console.log(response);
      this.directbillingTheRequirementService.removeTheRequestments(element);
    });
  }
}
