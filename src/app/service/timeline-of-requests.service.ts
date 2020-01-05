import { Injectable } from '@angular/core';

import { WebsocketService } from './websocket.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { TheRequirementService } from './the-requirement.service';
import { DirectbillingTheRequirementService } from './directbilling-the-requirement.service';
export interface Timer{
  minutes: number;
  seconds: number;
}

export interface RefundRequest{
  name:string;
  value: number;
  note:string;
}
@Injectable({
  providedIn: 'root'
})
export class TimelineOfRequestsService {

  listenCountdown$: BehaviorSubject<Timer> = new BehaviorSubject<Timer>(null);
  constructor(
    private webSocketService: WebsocketService,
    private theRequirementService: TheRequirementService,
    private directbillingTheRequirementService: DirectbillingTheRequirementService
  ) {
    this.fakeCountdown().subscribe(timer=>{
      this.listenCountdown$.next(timer);
    });
  }

  fakeCountdown():Observable<Timer>{
    let countdown = new Date();
    countdown.setMinutes(countdown.getMinutes()+6);
    // countdown.setSeconds(countdown.getSeconds()+10);

    return new Observable(observer=>{
      let x = setInterval(()=>{
        var now = new Date().getTime();
  
        // Find the distance between now and the count down date
        var distance = countdown.getTime() - now;
  
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let countDownTimer = { minutes: minutes, seconds: seconds }
        
        if (distance < 0) {
          countDownTimer = { minutes: -1, seconds: -1 };
          clearInterval(x);
        }
        observer.next(countDownTimer)
      },1000);
    })
  }

  listentWebSocket(){
    this.webSocketService.listenWebSocket().subscribe(res=>{
      let response = JSON.parse(res);
      console.log(response);
      if(response.data.check_benefit_status==='WAITING'){
        this.theRequirementService.setTheRequestments(response.data);
      }else if(response.data.check_benefit_status==='IN PROCESS'){
        this.directbillingTheRequirementService.setTheRequestments(response.data);
      }
    })
  }
}
