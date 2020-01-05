import { Injectable } from '@angular/core';

import { TimelineOfRequestsService } from './timeline-of-requests.service';

import { Observable, combineLatest } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TabPageService {
  pageNumber: number = 0;
  
  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService
  ) { }

  setPageNumber(number: number){
    this.pageNumber = number;
  }

  getPageNumber():number{
    return this.pageNumber;
  }
}
