import { Component, OnInit } from '@angular/core';

import { TabPageService } from 'src/app/service/tab-page.service';
import { ListTicketsService } from '../../../service/list-tickets.service';

import { Observable, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-directbilling',
  templateUrl: './directbilling.component.html',
  styleUrls: ['./directbilling.component.scss']
})
export class DirectbillingComponent implements OnInit {
  badgeRefundRequest: number;

  opdRequestProcessingBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdRequestProcessingBadge: Observable<number> = this.opdRequestProcessingBadge$.asObservable();

  opdRequestForRefundProcessingBadge$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  opdRequestForRefundProcessingBadge: Observable<number> = this.opdRequestForRefundProcessingBadge$.asObservable();
  constructor(
    public tabPageService: TabPageService,
    private listTicketsService: ListTicketsService
  ) { }

  ngOnInit() {
    this.listTicketsService.listenListTicket.subscribe(tickets=>{
      if(tickets){
        let opdRequestBadge: number = tickets.filter(ticket=> ticket.costs.length === 0 && ticket.insmart_status === 'TAKEN').length;
        this.opdRequestProcessingBadge$.next(opdRequestBadge);
  
        let opdRequestForRefundBadge: number = tickets.filter(ticket=> ticket.costs.length > 0 && ticket.insmart_status === 'TAKEN').length;
        this.opdRequestForRefundProcessingBadge$.next(opdRequestForRefundBadge);
      }
    })
  }

  onTabChanged(event){
    console.log(event);
  }
}
