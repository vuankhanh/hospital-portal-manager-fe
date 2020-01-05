import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineOfRequestsService, Timer } from '../../service/timeline-of-requests.service';
import { HospitalCheckService } from '../../service/hospital-check.service';
import { TabPageService } from '../../service/tab-page.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { TheRequirementService } from '../../service/the-requirement.service';
import { TraTuService } from '../../service/tra-tu.service';

@Component({
  selector: 'app-the-requirements',
  templateUrl: './the-requirements.component.html',
  styleUrls: ['./the-requirements.component.scss']
})
export class TheRequirementsComponent implements OnInit {
  theRequestments: any=[];
  countDownTimer: Timer;
  constructor(
    private router: Router,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private hospitalCheckService: HospitalCheckService,
    private tabPageService: TabPageService,
    private localStorageService: LocalStorageService,
    private theRequirementService: TheRequirementService,
    public traTuService: TraTuService
  ) {
    this.countDownTime();
  }

  ngOnInit() {
    this.theRequirementService.listenTheRequestments.subscribe(res=>{
      this.theRequestments = res;
    })
  }

  countDownTime(){
    this.timelineOfRequestsService.listenCountdown$.subscribe(timer=>{
      this.countDownTimer = timer;
    });
  }

  startProccess(element){
    //get index of element is selected in array
    let token = this.localStorageService.getLocal('token');
    this.hospitalCheckService.getHospitalCheck(element.id ,token).subscribe(res=>{
      if(res.code === 200){
        this.router.navigate(['/dashboard/directbilling']).then(_=>{
          this.theRequirementService.removeTheRequestments(element);
        });
      }
    });
  }
}
