import { Injectable } from '@angular/core';

import { DirectBillingService } from '../service/direct-billing.service';
import { TimelineOfRequestsService } from './timeline-of-requests.service';

import { Observable, combineLatest } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TabPageService {
  pageNumber: number = 0;
  
  constructor(
    private directBillingService : DirectBillingService,
    private timelineOfRequestsService: TimelineOfRequestsService
  ) { }

  setPageNumber(number: number){
    this.pageNumber = number;
  }

  getPageNumber():number{
    return this.pageNumber;
  }

  getBadgeRefundRequest(): Observable<number> {
    return this.directBillingService.listentDirectBilling$.asObservable().pipe(map(res=> res.length));
  }

  getBadgeDirectBilling(){
    return combineLatest([this.getBadgeRefundRequest()]).pipe(map(res=>res.reduce((a,b)=>a+b)));
  }

  //Badge của menu chính - Yêu cầu hoàn trả
  getBadgeRefundRequestPending(): Observable<number>{
    return this.timelineOfRequestsService.historyDirectBilling().pipe(map(res=>{
      return this.timelineOfRequestsService.returnPending(res);
    }))
  }

  // getBadgeTheRequirementsPending(): Observable<number>{
    
  // }
}
