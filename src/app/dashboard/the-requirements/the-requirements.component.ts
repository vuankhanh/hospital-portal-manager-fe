import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineOfRequestsService, Timer, IInterval } from '../../service/timeline-of-requests.service';
import { TakeService } from '../../service/api/put/take.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { TraTuService } from '../../service/tra-tu.service';
import { ListTicketsService } from '../../service/list-tickets.service';

import { interval, Observable,  } from 'rxjs';
import { map, } from 'rxjs/operators';
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
    private timelineOfRequestsService: TimelineOfRequestsService,
    private localStorageService: LocalStorageService,
    public traTuService: TraTuService,
    private listTicketsService: ListTicketsService
  ) {

    // this.listTicketsService.listenNoneCostsOpen.subscribe(resTickets=>{
    //   if(resTickets){
    //     // console.log(resTickets);
    //     this.theRequestments = resTickets.data.filter(ticket=>{
    //       return ticket.costs.length===0 && ticket.insmart_status === 'OPEN';
    //     });
    //     for(let theRequestment of this.theRequestments){
    //       theRequestment.countDown = this.timelineOfRequestsService.calcCountdown(15, theRequestment.created_at);
    //     }
    //     console.log(this.theRequestments);
    //   }
    // });
    
  }

  ngOnInit() {
    
  }

  startProccess(element){
    //get index of element is selected in array
    let userData = this.localStorageService.getLocalStorage('token');
    this.takeService.insmartTake(element.ID, userData.token).subscribe(res=>{
      if(res.code === 200){
        this.router.navigate(['/dashboard/directbilling']).then(_=>{
          // this.listTicketsService.changePropertyTicket(res.data);
        });
      }
    });
  }
}
