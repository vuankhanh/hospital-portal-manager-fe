import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineOfRequestsService, Timer } from '../../service/timeline-of-requests.service';
import { TakeService } from '../../service/api/put/take.service';
import { TabPageService } from '../../service/tab-page.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { TraTuService } from '../../service/tra-tu.service';
import { ListTicketsService } from '../../service/list-tickets.service';

import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-the-requirements',
  templateUrl: './the-requirements.component.html',
  styleUrls: ['./the-requirements.component.scss']
})
export class TheRequirementsComponent implements OnInit {
  theRequestments: any=[];
  countDownTimer: Timer;
  constructor(
    private takeService: TakeService,
    private router: Router,
    public timelineOfRequestsService: TimelineOfRequestsService,
    private tabPageService: TabPageService,
    private localStorageService: LocalStorageService,
    public traTuService: TraTuService,
    private listTicketsService: ListTicketsService
  ) {

    this.listTicketsService.listenListTicket.subscribe(resTickets=>{
      if(resTickets){
        // console.log(resTickets);
        this.theRequestments = resTickets.filter(ticket=>{
          return ticket.costs.length===0 && ticket.insmart_status === 'OPEN';
        });
        console.log(this.theRequestments);
      }
    })
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
    let token = this.localStorageService.getLocalStorage('token');
    this.takeService.insmartTake(element.ID ,token).subscribe(res=>{
      if(res.code === 200){
        this.router.navigate(['/dashboard/directbilling']).then(_=>{
          this.listTicketsService.changePropertyTicket(res.data);
          // this.theRequirementService.removeTheRequestments(element);
        });
      }
    });
  }
}
