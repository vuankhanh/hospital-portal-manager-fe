import { Injectable } from '@angular/core';

import { WebsocketService } from './api/websocket.service';

import { ListTicketsService } from './list-tickets.service';

import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators'
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
    private listTicketsService: ListTicketsService
  ) {
    this.fakeCountdown().subscribe(timer=>{
      this.listenCountdown$.next(timer);
    });
  }

  fakeCountdown():Observable<Timer>{
    let countdown = new Date();
    countdown.setMinutes(countdown.getMinutes()+20);
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
      
      this.listTicketsService.changePropertyTicket(response.data);
    })
  }

  getListTicket(){

  }

  calcCountdown(duration: number, createdCases: string, serverTimes: string){
    let createdCase = new Date(createdCases);
    let serverTime = new Date(serverTimes);
    let timeRemaining = this.pipeDurationToMinutes(duration) - (serverTime.getTime() - createdCase.getTime());
    console.log(timeRemaining)
    if((serverTime.getTime() - createdCase.getTime()) <= this.pipeDurationToMinutes(duration)){
      timeRemaining = this.pipeDurationToMinutes(duration) - (serverTime.getTime() - createdCase.getTime());
    }else{
      timeRemaining = 0;
    }

    return new Observable(observer=>{
      let x = setInterval(()=>{
        timeRemaining -= 1000;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        let countDownTimer = { minutes: minutes, seconds: seconds }
        
        if (timeRemaining <= 0) {
          countDownTimer = { minutes: -1, seconds: -1 };
          clearInterval(x);
          observer.complete();
        }
        observer.next(countDownTimer)
      },1000);
    })
  }

  pipeDurationToMinutes(duration: number){
    return duration *60*1000;
  }
}
