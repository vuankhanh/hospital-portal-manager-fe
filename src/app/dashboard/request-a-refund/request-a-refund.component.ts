import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineOfRequestsService, Timer, RefundRequest } from '../../service/timeline-of-requests.service';
import { TabPageService } from 'src/app/service/tab-page.service';
import { TraTuService } from '../../service/tra-tu.service';
import { ListTicketsService } from '../../service/list-tickets.service';
import { TakeService } from '../../service/api/put/take.service';
import { LocalStorageService } from '../../service/local-storage.service';

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
    public timelineOfRequestsService: TimelineOfRequestsService,
    private tabPageService: TabPageService,
    public traTuService: TraTuService,
    private listTicketsService: ListTicketsService,
    private takeService: TakeService,
    private localStorageService: LocalStorageService
  ) {
    
  }

  ngOnInit() {
    this.listTicketsService.listenListTicket.subscribe(resTickets=>{
      if(resTickets){
        
        this.refundRequests = resTickets.filter(ticket=>{
          return ticket.costs.length>0 && ticket.insmart_status === 'OPEN';
        });
        for(let theRequestment of this.refundRequests){
          theRequestment.countDown = this.timelineOfRequestsService.calcCountdown(15, theRequestment.created_at);
        }
        console.log(this.refundRequests);
      }
    });
  }

  countTotal(arrayNumber:any){
    let total = 0;
    arrayNumber.forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

  edit(element){
    console.log(element);
  }

  startProccess(element){
    let token = this.localStorageService.getLocalStorage('token');
    this.takeService.insmartTake(element.ID ,token).subscribe(res=>{
      if(res.code === 200){
        console.log(res);
        
        this.router.navigate(['/dashboard/directbilling']).then(_=>{
          this.listTicketsService.changePropertyTicket(res.data);
          this.tabPageService.setPageNumber(1);
        });
      }
    });
  }

}
